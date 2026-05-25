import { Link, useNavigate } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart, cartStore } from "@/lib/cart-store";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Loja", to: "/products" as const, search: {} as { category?: string } },
  { label: "Camisetas", to: "/products" as const, search: { category: "Camisetas" } },
  { label: "Moletons", to: "/products" as const, search: { category: "Moletons" } },
  { label: "Jaquetas", to: "/products" as const, search: { category: "Jaquetas" } },
  { label: "Calçados", to: "/products" as const, search: { category: "Calçados" } },
];

export function Header() {
  const cart = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const count = cart.items.reduce((a, i) => a + i.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileOpen(false);
    navigate({ to: "/search", search: { q } });
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/90 border-b border-border transition-all duration-300">
      <div className="bg-charcoal/80 text-foreground/70 text-[9px] md:text-[11px] tracking-luxury uppercase py-1.5 md:py-2 text-center px-4 overflow-hidden whitespace-nowrap">
        Frete grátis acima de R$299 · 4x sem juros · 5% off no PIX
      </div>
      <div className="container-ch flex items-center justify-between h-14 md:h-20 gap-4">
        <button className="md:hidden text-foreground -ml-1 p-1" onClick={() => setMobileOpen((v) => !v)} aria-label="Menu">
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <div className="relative p-[2px] rounded-full bg-gradient-gold shadow-gold">
            <img 
              src="/logo.jpg" 
              alt="CH.STYLE" 
              className="h-10 md:h-12 w-10 md:w-12 rounded-full object-cover border-2 border-background" 
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-xs lg:text-sm uppercase tracking-luxury">
          {navItems.map((n) => (
            <Link key={n.label} to={n.to} search={n.search} className="hover:text-gold transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button onClick={() => setSearchOpen((v) => !v)} className="text-foreground/80 hover:text-gold transition-colors" aria-label="Buscar">
            <Search className="size-5" />
          </button>
          <Link to="/account" className="hidden md:inline-flex text-foreground/80 hover:text-gold transition-colors" aria-label="Conta">
            <User className="size-5" />
          </Link>
          <button onClick={() => cartStore.open()} className="relative text-foreground/80 hover:text-gold transition-colors" aria-label="Carrinho">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-primary-foreground text-[10px] font-semibold rounded-full size-4 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl animate-fade-up">
          <form onSubmit={submitSearch} className="container-ch py-4 flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="flex-1 bg-charcoal border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
            <button type="submit" className="bg-gradient-gold text-primary-foreground px-6 text-xs uppercase tracking-luxury font-semibold">
              Buscar
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 top-[calc(2rem+4rem)] z-30 bg-black/50" />
          <nav className="md:hidden absolute left-0 right-0 z-40 border-t border-border bg-background animate-fade-up">
            <div className="container-ch py-6 flex flex-col gap-1 text-sm uppercase tracking-luxury">
              {navItems.map((n) => (
                <Link key={n.label} to={n.to} search={n.search} onClick={() => setMobileOpen(false)} className="py-3 border-b border-border hover:text-gold">
                  {n.label}
                </Link>
              ))}
              <Link to="/account" onClick={() => setMobileOpen(false)} className="py-3 border-b border-border hover:text-gold">Minha conta</Link>
              <Link to="/help/$topic" params={{ topic: "contato" }} onClick={() => setMobileOpen(false)} className="py-3 hover:text-gold">Atendimento</Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
