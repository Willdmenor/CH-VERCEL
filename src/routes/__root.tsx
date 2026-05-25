import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Erro 404</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Página não encontrada</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido permanentemente.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-gold text-gold px-8 py-3 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors"
          >
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error("Critical Route Error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="text-[11px] uppercase tracking-luxury text-destructive mb-2">Ops! Algo deu errado</p>
        <h1 className="font-display text-4xl font-bold text-foreground">
          Falha no carregamento
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Houve um erro técnico inesperado. Nossa equipe já foi notificada.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-gold text-primary-foreground px-8 py-3 text-xs uppercase tracking-luxury font-semibold hover:shadow-gold transition-shadow"
          >
            Tentar Novamente
          </button>
          <a
            href="/"
            className="border border-border px-8 py-3 text-xs uppercase tracking-luxury hover:border-gold transition-colors"
          >
            Página Inicial
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CH.Style — Moda masculina premium" },
      { name: "description", content: "Curadoria editorial em moda masculina premium. Frete grátis acima de R$299, 4x sem juros e 5% off no PIX." },
      { name: "author", content: "CH.Style" },
      { property: "og:title", content: "CH.Style — Moda masculina premium" },
      { property: "og:description", content: "Curadoria editorial em moda masculina premium." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
        <link rel="canonical" href="https://ch.style" />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="top-right" theme="dark" richColors />
    </QueryClientProvider>
  );
}
