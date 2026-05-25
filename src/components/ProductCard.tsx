import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";

const formatBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const badgeStyles: Record<string, string> = {
  novo: "bg-foreground text-background",
  bestseller: "bg-gold text-primary-foreground",
  promo: "bg-destructive text-destructive-foreground",
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group block hover-lift"
    >
      <div className="relative overflow-hidden bg-charcoal aspect-[4/5]">
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] uppercase tracking-luxury px-2.5 py-1 ${badgeStyles[product.badge]}`}>
            {product.badge}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/1a1a1a/c9a84c?text=Produto';
          }}
        />
      </div>
      <div className="pt-4 space-y-1">
        <p className="text-[10px] uppercase tracking-luxury text-muted-foreground">{product.category}</p>
        <h3 className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">{product.name}</h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className="text-base font-display font-semibold">{formatBRL(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatBRL(product.oldPrice)}</span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          ou 4x de {formatBRL(product.price / 4)} sem juros
        </p>
      </div>
    </Link>
  );
}
