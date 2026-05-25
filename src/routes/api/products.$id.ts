// GET/PUT/PATCH/DELETE /api/products/:id  (aceita id OU slug)
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { supabase } from "@/integrations/supabase/client";

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers || {}) },
  });
}
function err(m: string, status = 500, details?: unknown) {
  return json({ error: m, details }, { status });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function findByIdOrSlug(idOrSlug: string) {
  const q = supabaseAdmin
    .from("products")
    .select("*, product_images(*), product_variants(*)");
  const { data, error } = UUID_RE.test(idOrSlug)
    ? await q.eq("id", idOrSlug).maybeSingle()
    : await q.eq("slug", idOrSlug).maybeSingle();
  if (error) throw error;
  return data;
}

function toApi(p: any) {
  return {
    id: p.id, slug: p.slug, name: p.name, description: p.description,
    priceCents: p.price_cents, category: p.category, active: p.active,
    createdAt: p.created_at, updatedAt: p.updated_at,
    images: (p.product_images ?? []).slice().sort((a: any, b: any) => a.position - b.position),
    variants: p.product_variants ?? [],
  };
}

async function handleUpdate(id: string, request: Request) {
  let body: any;
  try { body = await request.json(); } catch { return err("JSON inválido", 400); }
  const existing = await findByIdOrSlug(id);
  if (!existing) return err("Produto não encontrado", 404);

  const update: Record<string, unknown> = {};
  if (body.slug !== undefined) update.slug = body.slug;
  if (body.name !== undefined) update.name = body.name;
  if (body.description !== undefined) update.description = body.description;
  if (typeof body.priceCents === "number") update.price_cents = body.priceCents;
  if (body.category !== undefined) update.category = body.category;
  if (typeof body.active === "boolean") update.active = body.active;
  update.updated_at = new Date().toISOString();

  const { error: eUp } = await supabaseAdmin.from("products").update(update as any).eq("id", existing.id);
  if (eUp) {
    if ((eUp as any).code === "23505") return err("Slug já em uso", 409);
    throw eUp;
  }

  if (Array.isArray(body.images)) {
    await supabaseAdmin.from("product_images").delete().eq("product_id", existing.id);
    const rows = body.images.filter((i: any) => i?.url).map((i: any, idx: number) => ({
      product_id: existing.id, url: i.url, alt: i.alt ?? null, position: i.position ?? idx,
    }));
    if (rows.length) {
      const { error } = await supabaseAdmin.from("product_images").insert(rows);
      if (error) throw error;
    }
  }
  if (Array.isArray(body.variants)) {
    await supabaseAdmin.from("product_variants").delete().eq("product_id", existing.id);
    const rows = body.variants.filter((v: any) => v?.color && v?.size).map((v: any) => ({
      product_id: existing.id, color: v.color, size: v.size,
      stock: Number(v.stock) || 0, sku: v.sku || null,
    }));
    if (rows.length) {
      const { error } = await supabaseAdmin.from("product_variants").insert(rows);
      if (error) throw error;
    }
  }

  const full = await findByIdOrSlug(existing.id);
  return json(toApi(full));
}

export const Route = createFileRoute("/api/products/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const p = await findByIdOrSlug(params.id);
          if (!p) return err("Produto não encontrado", 404);
          return json(toApi(p));
        } catch (e: any) {
          console.error("[GET /api/products/:id]", e);
          return err(e?.message || "Falha ao buscar produto", 500);
        }
      },
      PUT: async ({ params, request }) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return err("Não autorizado", 401);
          return await handleUpdate(params.id, request);
        }
        catch (e: any) { console.error("[PUT]", e); return err(e?.message || "Falha ao atualizar produto", 500); }
      },
      PATCH: async ({ params, request }) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return err("Não autorizado", 401);
          return await handleUpdate(params.id, request);
        }
        catch (e: any) { console.error("[PATCH]", e); return err(e?.message || "Falha ao atualizar produto", 500); }
      },
      DELETE: async ({ params }) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return err("Não autorizado", 401);

          const existing = await findByIdOrSlug(params.id);
          if (!existing) return err("Produto não encontrado", 404);
          const { error } = await supabaseAdmin.from("products").delete().eq("id", existing.id);
          if (error) throw error;
          return json({ success: true, id: existing.id });
        } catch (e: any) {
          console.error("[DELETE]", e);
          return err(e?.message || "Falha ao remover produto", 500);
        }
      },
    },
  },
});
