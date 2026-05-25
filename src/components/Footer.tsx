import { Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "@tanstack/react-router";

const cols = [
  { title: "Institucional", links: [
    { label: "Sobre", to: "sobre" },
    { label: "Lojas", to: "lojas" },
    { label: "Sustentabilidade", to: "sustentabilidade" },
    { label: "Carreira", to: "carreira" },
  ]},
  { title: "Ajuda", links: [
    { label: "Trocas e Devoluções", to: "trocas" },
    { label: "Frete e Prazo", to: "frete" },
    { label: "Pagamento", to: "pagamento" },
    { label: "Contato", to: "contato" },
  ]},
  { title: "Legal", links: [
    { label: "Privacidade", to: "privacidade" },
    { label: "Termos", to: "termos" },
    { label: "Cookies", to: "cookies" },
    { label: "Segurança", to: "seguranca" },
  ]},
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-charcoal mt-24">
      <div className="container-ch py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="font-display font-bold text-xl tracking-luxury">CH<span className="text-gold">.</span>STYLE</Link>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-xs">
            Moda masculina premium. Curadoria editorial em cada peça.
          </p>
          <div className="flex gap-4 mt-6 text-foreground/60">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors"><Instagram className="size-5" /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-gold transition-colors"><Facebook className="size-5" /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube" className="hover:text-gold transition-colors"><Youtube className="size-5" /></a>
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs uppercase tracking-luxury text-gold mb-4">{col.title}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to="/help/$topic" params={{ topic: l.to }} className="hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-ch py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} CH.Style — Todos os direitos reservados</span>
          <span>CNPJ 00.000.000/0001-00</span>
        </div>
      </div>
    </footer>
  );
}
