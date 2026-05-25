import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart, cartStore } from "@/lib/cart-store";
import { useEffect } from "react";
import { Link } from "@tanstack/react-router";

const formatBRL = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const FREE_SHIPPING = 299;

export function CartDrawer() {
  const cart = useCart();
  const subtotal = cart.items.reduce((a, i) => a + i.price * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  useEffect(() => {
    document.body.style.overflow = cart.isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cart.isOpen]);

  return (
    <>
      <div
        onClick={() => cartStore.close()}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${cart.isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-background border-l border-border shadow-noir transition-transform duration-400 ease-out ${cart.isOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Carrinho"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 border-b border-border">
            <h2 className="text-sm uppercase tracking-luxury">Sacola ({cart.items.length})</h2>
            <button onClick={() => cartStore.close()} aria-label="Fechar"><X className="size-5" /></button>
          </div>

          {cart.items.length > 0 && (
            <div className="px-5 py-4 border-b border-border space-y-2">
              <p className="text-xs text-muted-foreground">
                {remaining > 0
                  ? <>Faltam <span className="text-gold font-semibold">{formatBRL(remaining)}</span> para <strong className="text-foreground">frete grátis</strong></>
                  : <span className="text-gold font-semibold">✓ Você ganhou frete grátis!</span>}
              </p>
              <div className="h-1 bg-charcoal rounded-full overflow-hidden">
                <div className="h-full bg-gradient-gold transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center px-8 text-center gap-4">
                <ShoppingBag className="size-12 text-muted-foreground/40" />
                <div>
                  <p className="font-display text-lg">Sua sacola está vazia</p>
                  <p className="text-sm text-muted-foreground mt-1">Descubra nossas peças premium</p>
                </div>
                <button onClick={() => cartStore.close()} className="mt-2 text-xs uppercase tracking-luxury border border-gold text-gold px-6 py-3 hover:bg-gold hover:text-primary-foreground transition-colors">
                  Continuar comprando
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {cart.items.map((i) => (
                  <li key={`${i.id}-${i.size}-${i.color}`} className="p-5 flex gap-4">
                    <img src={i.image} alt={i.name} className="size-20 object-cover bg-charcoal" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{i.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{i.size} · {i.color}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border">
                          <button onClick={() => cartStore.updateQty(i.id, i.size, i.color, i.quantity - 1)} className="p-1.5 hover:text-gold" aria-label="Diminuir"><Minus className="size-3" /></button>
                          <span className="px-3 text-xs">{i.quantity}</span>
                          <button onClick={() => cartStore.updateQty(i.id, i.size, i.color, i.quantity + 1)} className="p-1.5 hover:text-gold" aria-label="Aumentar"><Plus className="size-3" /></button>
                        </div>
                        <span className="text-sm font-display font-semibold">{formatBRL(i.price * i.quantity)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.items.length > 0 && (
            <div className="border-t border-border p-5 space-y-4 bg-charcoal">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-luxury text-muted-foreground">Subtotal</span>
                <span className="text-xl font-display font-semibold">{formatBRL(subtotal)}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                ou {formatBRL(subtotal * 0.95)} no PIX (-5%) · 4x de {formatBRL(subtotal / 4)} sem juros
              </p>
              <Link
                to="/checkout"
                onClick={() => cartStore.close()}
                className="block text-center w-full bg-gradient-gold text-primary-foreground py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow"
              >
                Finalizar compra
              </Link>
              <button onClick={() => cartStore.close()} className="block w-full text-center text-[11px] uppercase tracking-luxury text-muted-foreground hover:text-gold">
                Continuar comprando
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
