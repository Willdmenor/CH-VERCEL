import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { useMemo, useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  sort: z.enum(["relevance", "price-asc", "price-desc", "newest"]).optional(),
});

export const Route = createFileRoute("/products")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Loja — CH.Style" },
      { name: "description", content: "Catálogo completo CH.Style. Camisetas, moletons, jaquetas, calças, calçados e acessórios premium." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const location = useLocation();
  const { category, sort = "relevance" } = Route.useSearch();
  const navigate = useNavigate({ from: "/products" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [category, sort]);

  const filtered = useMemo(() => {
    let list = products;
    if (category) list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => (a.badge === "novo" ? -1 : 1));
    return list;
  }, [category, sort]);

  const setCategory = (c: string | undefined) =>
    navigate({ search: (prev: { category?: string; sort?: typeof sort }) => ({ ...prev, category: c }) });
  const setSort = (s: typeof sort) =>
    navigate({ search: (prev: { category?: string; sort?: typeof sort }) => ({ ...prev, sort: s }) });

  if (location.pathname !== "/products") {
    return <Outlet />;
  }

  return (
    <div className="container-ch py-12 md:py-16">
      <div className="mb-10 animate-fade-up">
        <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Coleção FW25</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold">{category ?? "Loja"}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "peça disponível" : "peças disponíveis"}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(undefined)}
            className={`text-[11px] uppercase tracking-luxury px-4 py-2 border transition-colors ${!category ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold hover:text-gold"}`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.name)}
              className={`text-[11px] uppercase tracking-luxury px-4 py-2 border transition-colors ${category === c.name ? "bg-gold text-primary-foreground border-gold" : "border-border hover:border-gold hover:text-gold"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-charcoal border border-border text-xs uppercase tracking-luxury px-3 py-2 focus:border-gold focus:outline-none"
          >
            <option value="relevance">Relevância</option>
            <option value="newest">Novidades</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/5] skeleton" />
              <div className="h-3 w-1/3 skeleton" />
              <div className="h-4 w-2/3 skeleton" />
              <div className="h-4 w-1/4 skeleton" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-muted-foreground mb-6">Nenhum produto encontrado nesta categoria.</p>
          <button onClick={() => setCategory(undefined)} className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
            Ver todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 animate-fade-up">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
