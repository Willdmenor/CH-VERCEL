// GET  /api/products  — listagem (filtros: category, active, search)
// POST /api/products  — cria produto (com imagens e variantes opcionais)
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { supabase } from "@/integrations/supabase/client";

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json", ...(init.headers || {}) },
  });
}
function err(message: string, status = 500, details?: unknown) {
  return json({ error: message, details }, { status });
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_cents: number;
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  product_images: { id: string; url: string; alt: string | null; position: number }[];
  product_variants: { id: string; color: string; size: string; stock: number; sku: string | null }[];
};

function toApi(p: ProductRow) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceCents: p.price_cents,
    category: p.category,
    active: p.active,
    createdAt: p.created_at,
    updatedAt: p.updated_at,
    images: (p.product_images ?? [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((i) => ({ id: i.id, url: i.url, alt: i.alt, position: i.position })),
    variants: (p.product_variants ?? []).map((v) => ({
      id: v.id, color: v.color, size: v.size, stock: v.stock, sku: v.sku,
    })),
  };
}

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const category = url.searchParams.get("category");
          const active = url.searchParams.get("active");
          const search = url.searchParams.get("search")?.trim();
          const page = Math.max(1, Number(url.searchParams.get("page") || 1));
          const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") || 20)));
          const from = (page - 1) * pageSize;
          const to = from + pageSize - 1;

          let q = supabaseAdmin
            .from("products")
            .select("*, product_images(*), product_variants(*)", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

          if (category) q = q.eq("category", category);
          if (active === "true" || active === "false") q = q.eq("active", active === "true");
          if (search) q = q.or(`name.ilike.%${search}%,slug.ilike.%${search}%,category.ilike.%${search}%`);

          const { data, error, count } = await q;
          if (error) throw error;

          const items = (data as ProductRow[]).map(toApi);
          const total = count ?? items.length;
          return json({
            items, page, pageSize, total,
            totalPages: Math.max(1, Math.ceil(total / pageSize)),
          });
        } catch (e: any) {
          console.error("[GET /api/products]", e);
          return err(e?.message || "Falha ao listar produtos", 500);
        }
      },

      POST: async ({ request }) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) return err("Não autorizado", 401);

          // Verificar se o usuário tem role ADMIN (exemplo de check adicional)
          // Se as políticas de RLS já cuidarem disso, o getSession() básico pode bastar
          // mas para supabaseAdmin bypass, precisamos de proteção manual.
          
          const body = await request.json().catch(() => null);
          if (!body) return err("JSON inválido", 400);
          const { slug, name, description, priceCents, category, active = true, images = [], variants = [] } = body;
          if (!slug || !name || typeof priceCents !== "number" || !category) {
            return err("Campos obrigatórios faltando", 422);
          }

          const { data: created, error: e1 } = await supabaseAdmin
            .from("products")
            .insert({ slug, name, description: description ?? "", price_cents: priceCents, category, active })
            .select("*")
            .single();
          if (e1) {
            if (e1.code === "23505") return err("Slug já em uso", 409);
            throw e1;
          }

          if (Array.isArray(images) && images.length) {
            const rows = images.filter((i: any) => i?.url).map((i: any, idx: number) => ({
              product_id: created.id, url: i.url, alt: i.alt ?? null, position: i.position ?? idx,
            }));
            if (rows.length) {
              const { error } = await supabaseAdmin.from("product_images").insert(rows);
              if (error) throw error;
            }
          }
          if (Array.isArray(variants) && variants.length) {
            const rows = variants.filter((v: any) => v?.color && v?.size).map((v: any) => ({
              product_id: created.id, color: v.color, size: v.size,
              stock: Number(v.stock) || 0, sku: v.sku || null,
            }));
            if (rows.length) {
              const { error } = await supabaseAdmin.from("product_variants").insert(rows);
              if (error) throw error;
            }
          }

          const { data: full, error: e2 } = await supabaseAdmin
            .from("products")
            .select("*, product_images(*), product_variants(*)")
            .eq("id", created.id)
            .single();
          if (e2) throw e2;
          return json(toApi(full as ProductRow), { status: 201 });
        } catch (e: any) {
          console.error("[POST /api/products]", e);
          return err(e?.message || "Falha ao criar produto", 500);
        }
      },
    },
  },
});
