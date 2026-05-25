import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";
import { z } from "zod";

export const Route = createFileRoute("/search")({
  validateSearch: (s) => z.object({ q: z.string().optional() }).parse(s),
  head: () => ({
    meta: [{ title: "Busca — CH.Style" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q = "" } = Route.useSearch();
  const term = q.toLowerCase().trim();
  const results = term
    ? products.filter((p) =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      )
    : [];

  return (
    <div className="container-ch py-12 md:py-16">
      <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Busca</p>
      <h1 className="font-display text-3xl md:text-5xl font-bold">
        {term ? `Resultados para "${q}"` : "O que você procura?"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {term ? `${results.length} ${results.length === 1 ? "produto encontrado" : "produtos encontrados"}` : "Use a lupa no topo para buscar"}
      </p>

      {term && results.length === 0 && (
        <div className="py-24 text-center border border-border mt-10">
          <p className="text-muted-foreground mb-6">Nada encontrado. Tente outra palavra-chave.</p>
          <Link to="/products" search={{}} className="border border-gold text-gold px-8 py-3 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
            Ver toda a loja
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 animate-fade-up">
          {results.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
