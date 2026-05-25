import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/ProductCard";
import { products, categories } from "@/lib/products";
import { Truck, ShieldCheck, CreditCard, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CH.Style — Moda Masculina Premium | Camisetas, Moletons e Jaquetas" },
      { name: "description", content: "Curadoria exclusiva de moda masculina premium. Encontre camisetas pima, moletons oversized e acessórios de luxo com frete grátis e 5% OFF no PIX." },
    ],
  }),
  component: Home,
});

function Home() {
  const newArrivals = products.filter((p) => p.badge === "novo");

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    form.reset();
    toast.success("Inscrição confirmada!", { description: "Cupom de 10% enviado para seu e-mail." });
  };

  return (
    <>
      <HeroCarousel />

      <section className="border-y border-border bg-charcoal/30 backdrop-blur-sm overflow-x-auto no-scrollbar">
        <div className="container-ch flex md:grid md:grid-cols-4 divide-x divide-border min-w-max md:min-w-full">
          {[
            { icon: Truck, label: "Frete grátis", sub: "acima de R$299" },
            { icon: CreditCard, label: "4x sem juros", sub: "ou 5% off no PIX" },
            { icon: RotateCcw, label: "Trocas em 30 dias", sub: "sem complicação" },
            { icon: ShieldCheck, label: "Compra segura", sub: "selo SSL" },
          ].map((item) => (
            <div key={item.label} className="py-4 md:py-5 px-6 md:px-4 flex items-center gap-3 flex-1">
              <item.icon className="size-4 md:size-5 text-gold shrink-0" />
              <div className="whitespace-nowrap">
                <p className="text-[10px] md:text-[11px] uppercase tracking-luxury font-medium">{item.label}</p>
                <p className="text-[9px] md:text-[10px] text-muted-foreground">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-ch py-20 md:py-28">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Curadoria</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Categorias</h2>
          </div>
          <Link to="/products" search={{}} className="hidden md:inline text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold transition-colors">Ver tudo →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/products"
              search={{ category: c.name }}
              className="group relative aspect-[3/4] overflow-hidden bg-charcoal hover-lift"
            >
              <img 
                src={c.image} 
                alt={c.name} 
                loading="lazy" 
                className="absolute inset-0 size-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://placehold.co/400x500/1a1a1a/c9a84c?text=${c.name}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className="text-sm md:text-base font-display font-semibold group-hover:text-gold transition-colors">{c.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-ch py-20 md:py-28 border-t border-border">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Seleção CH</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold">Coleção Completa</h2>
          </div>
          <Link to="/products" search={{}} className="hidden md:inline text-xs uppercase tracking-luxury text-muted-foreground hover:text-gold transition-colors">Ver tudo →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <div className="mt-12 flex justify-center">
          <Link to="/products" search={{}} className="border border-gold text-gold px-10 py-4 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
            Ver tudo
          </Link>
        </div>
      </section>

      <section className="relative py-24 md:py-36 my-12 bg-gradient-noir overflow-hidden">
        <div className="container-ch relative text-center max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-luxury text-gold mb-4">Editorial FW25</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight">
            Para quem entende que <span className="text-gold italic font-light">menos é mais</span>.
          </h2>
          <p className="mt-6 text-foreground/70 text-base md:text-lg leading-relaxed">
            Cada peça é selecionada por sua construção, caimento e atemporalidade. Não seguimos tendências — definimos códigos.
          </p>
          <Link to="/products" search={{}} className="inline-block mt-10 border border-gold text-gold px-10 py-4 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
            Descobrir a coleção
          </Link>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="container-ch py-20 md:py-28">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Recém chegados</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold">Novidades</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
            {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <section className="container-ch py-20 md:py-28 border-t border-border">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-luxury text-gold mb-3">Newsletter</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Acesso antecipado</h2>
          <p className="mt-4 text-muted-foreground">Receba 10% off na primeira compra e seja o primeiro a ver lançamentos.</p>
          <form className="mt-8 flex flex-col sm:flex-row gap-2" onSubmit={subscribe}>
            <input type="email" required placeholder="seu@email.com" className="flex-1 bg-charcoal border border-border px-5 py-4 text-sm focus:border-gold focus:outline-none transition-colors" />
            <button className="bg-gradient-gold text-primary-foreground px-8 py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow">Inscrever</button>
          </form>
        </div>
      </section>
    </>
  );
}
