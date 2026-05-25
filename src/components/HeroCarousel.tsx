import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";

const slides = [
  { image: hero1, eyebrow: "Coleção FW25", title: "Silhueta\nNoir", subtitle: "Alfaiataria contemporânea em tons profundos. Editorial premium.", cta: "Ver coleção", category: undefined as string | undefined },
  { image: hero2, eyebrow: "Detalhe Conta", title: "Toque\nDourado", subtitle: "Acessórios que elevam o essencial ao excepcional.", cta: "Explorar acessórios", category: "Acessórios" },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative h-[88vh] md:h-[92vh] overflow-hidden bg-background">
      {slides.map((s, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${active === i ? "opacity-100" : "opacity-0"}`}>
          <img src={s.image} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      ))}

      <div className="container-ch relative h-full flex items-end md:items-center pb-20 md:pb-0">
        <div key={active} className="max-w-xl animate-fade-up">
          <p className="text-[11px] uppercase tracking-luxury text-gold mb-4">{slides[active].eyebrow}</p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] whitespace-pre-line">
            {slides[active].title}
          </h1>
          <p className="mt-6 text-base md:text-lg text-foreground/70 max-w-md leading-relaxed">
            {slides[active].subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              search={slides[active].category ? { category: slides[active].category } : {}}
              className="bg-gradient-gold text-primary-foreground px-8 py-4 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow"
            >
              {slides[active].cta}
            </Link>
            <Link to="/help/$topic" params={{ topic: "sobre" }} className="border border-foreground/30 text-foreground px-8 py-4 text-xs uppercase tracking-luxury hover:border-gold hover:text-gold transition-colors">
              Lookbook
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Slide ${i + 1}`}
            className={`h-[2px] transition-all duration-500 ${active === i ? "w-12 bg-gold" : "w-6 bg-foreground/30"}`} />
        ))}
      </div>
    </section>
  );
}
