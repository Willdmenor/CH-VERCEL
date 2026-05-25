import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProduct, products, type Product } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { Heart, Truck, RotateCcw, ShieldCheck, Minus, Plus } from "lucide-react";
import { cartStore } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { product } = loaderData;
    const jsonLd = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.image,
      "description": product.description,
      "sku": product.id,
      "offers": {
        "@type": "Offer",
        "url": `https://ch.style/products/${product.slug}`,
        "priceCurrency": "BRL",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "itemCondition": "https://schema.org/NewCondition"
      }
    };

    return {
      meta: [
        { title: `${product.name} — CH.Style | Moda Masculina Premium` },
        { name: "description", content: product.description.substring(0, 160) },
        { property: "og:title", content: `${product.name} — CH.Style` },
        { property: "og:description", content: product.description.substring(0, 160) },
        { property: "og:image", content: product.image },
        { property: "og:type", content: "product" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-ch py-32 text-center">
      <h1 className="font-display text-4xl mb-4">Produto não encontrado</h1>
      <Link to="/products" className="text-gold hover:underline">Voltar à loja</Link>
    </div>
  ),
});

const formatBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function ProductPage() {
  const { product } = Route.useLoaderData() as { product: Product };
  const [size, setSize] = useState<string>(product.sizes[1] ?? product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [cep, setCep] = useState("");
  const [shipping, setShipping] = useState<{ label: string; days: string; price: string }[] | null>(null);

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4);
  const allRelated = related.length ? related : products.filter((p) => p.id !== product.id).slice(0, 4);

  const calcShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (cep.replace(/\D/g, "").length !== 8) return;
    setShipping([
      { label: "PAC", days: "5-8 dias úteis", price: "Grátis" },
      { label: "SEDEX", days: "2-3 dias úteis", price: formatBRL(29.9) },
      { label: "Expressa", days: "1 dia útil", price: formatBRL(49.9) },
    ]);
  };

  const addToCart = () => {
    cartStore.add({
      id: product.id, slug: product.slug, name: product.name,
      price: product.price, image: product.image,
      size, color: color.name,
    }, qty);
    toast.success("Adicionado à sacola", { description: `${product.name} · ${size} · ${color.name}` });
  };

  return (
    <div className="container-ch py-8 md:py-14">
      <nav className="text-xs text-muted-foreground mb-6">
        <Link to="/" className="hover:text-gold">Home</Link> /{" "}
        <Link to="/products" className="hover:text-gold">Loja</Link> /{" "}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[4/5] bg-charcoal overflow-hidden group">
            <img src={product.image} alt={product.name} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110" />
          </div>
          {/* Galeria simples sem troca automática inesperada */}
          <div className="grid grid-cols-3 gap-3">
            {[product.image, product.imageHover, product.image].filter(Boolean).map((src, i) => (
              <div key={i} className="aspect-square bg-charcoal overflow-hidden cursor-pointer hover:ring-1 hover:ring-gold transition-all">
                <img src={src} alt="" className="size-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="lg:sticky lg:top-28 lg:self-start space-y-6">
          <div>
            <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">{product.category}</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold leading-tight">{product.name}</h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">{formatBRL(product.price)}</span>
            {product.oldPrice && <span className="text-sm text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ou 4x de <strong className="text-foreground">{formatBRL(product.price / 4)}</strong> sem juros</p>
            <p><span className="text-gold font-semibold">{formatBRL(product.price * 0.95)}</span> à vista no PIX (-5%)</p>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Color */}
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-luxury mb-0">Cor: <span className="text-muted-foreground">{color.name}</span></p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button key={c.name} onClick={() => setColor(c)} aria-label={c.name}
                  className={`size-10 md:size-12 rounded-full border-2 transition-all duration-300 ${color.name === c.name ? "border-gold scale-110 shadow-gold" : "border-border hover:border-gold/50"}`}
                  style={{ backgroundColor: c.hex }} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-[11px] uppercase tracking-luxury mb-0">Tamanho: <span className="text-muted-foreground">{size}</span></p>
              <button className="text-[10px] md:text-[11px] uppercase tracking-luxury text-gold hover:underline">Guia de medidas</button>
            </div>
            <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)}
                  className={`h-11 md:h-14 flex items-center justify-center px-2 md:px-5 border text-xs md:text-sm transition-all duration-300 font-medium ${size === s ? "bg-foreground text-background border-foreground" : "border-border hover:border-gold hover:text-gold"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <div className="flex items-center border border-border h-14 w-full sm:w-auto">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex-1 sm:px-4 h-full hover:text-gold transition-colors" aria-label="Diminuir"><Minus className="size-4 mx-auto" /></button>
              <span className="w-12 text-center text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex-1 sm:px-4 h-full hover:text-gold transition-colors" aria-label="Aumentar"><Plus className="size-4 mx-auto" /></button>
            </div>
            <button onClick={addToCart} className="flex-[2] bg-gradient-gold text-primary-foreground h-14 text-[11px] uppercase tracking-luxury font-bold hover:shadow-gold transition-all duration-500 active:scale-[0.98]">
              Adicionar à sacola
            </button>
            <button className="border border-border h-14 w-full sm:w-14 flex items-center justify-center hover:border-gold hover:text-gold transition-colors" aria-label="Favoritar">
              <Heart className="size-5" />
            </button>
          </div>

          {/* Shipping */}
          <div className="border-t border-border pt-6 space-y-3">
            <p className="text-[11px] uppercase tracking-luxury">Calcular frete e prazo</p>
            <form onSubmit={calcShipping} className="flex gap-2">
              <input value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" maxLength={9}
                className="flex-1 bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none" />
              <button className="border border-gold text-gold px-5 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">Calcular</button>
            </form>
            {shipping && (
              <ul className="divide-y divide-border border border-border">
                {shipping.map((s) => (
                  <li key={s.label} className="flex items-center justify-between p-3 text-sm">
                    <div>
                      <p className="font-medium">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.days}</p>
                    </div>
                    <span className={`text-sm font-semibold ${s.price === "Grátis" ? "text-gold" : ""}`}>{s.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Trust */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            {[
              { icon: Truck, label: "Frete grátis +R$299" },
              { icon: RotateCcw, label: "Trocas em 30 dias" },
              { icon: ShieldCheck, label: "Compra segura" },
            ].map((i) => (
              <div key={i.label} className="text-center">
                <i.icon className="size-5 text-gold mx-auto mb-1.5" />
                <p className="text-[10px] text-muted-foreground leading-tight">{i.label}</p>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="border-t border-border pt-6 space-y-px">
            {[
              {
                title: "Composição & Cuidados",
                body: "Tecido premium selecionado. Lavar à mão ou ciclo delicado a 30°C. Não usar alvejante. Secar à sombra. Passar do avesso em temperatura baixa.",
              },
              {
                title: "Entrega & Prazo",
                body: "Envio em até 2 dias úteis após confirmação. Frete grátis para compras acima de R$299. SEDEX, PAC e Expressa disponíveis em todo o Brasil.",
              },
              {
                title: "Trocas & Devoluções",
                body: "Você tem 30 dias para trocar ou devolver. Peça lacrada, sem uso e com etiqueta. Primeira troca por frete cortesia.",
              },
            ].map((d) => (
              <details key={d.title} className="group border-b border-border last:border-b-0">
                <summary className="flex items-center justify-between py-4 cursor-pointer list-none text-[11px] uppercase tracking-luxury hover:text-gold transition-colors">
                  {d.title}
                  <Plus className="size-4 transition-transform group-open:rotate-45" />
                </summary>
                <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-24 pt-16 border-t border-border">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Você também pode gostar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
          {allRelated.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
