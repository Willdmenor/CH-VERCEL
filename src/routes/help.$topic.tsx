import { createFileRoute, Link } from "@tanstack/react-router";

const topics: Record<string, { title: string; body: string[] }> = {
  sobre: { title: "Sobre a CH.Style", body: ["Curadoria editorial em moda masculina premium.", "Cada peça é selecionada por sua construção, caimento e atemporalidade."] },
  lojas: { title: "Nossas Lojas", body: ["Em breve, lojas físicas em São Paulo e Rio de Janeiro.", "Por enquanto, atendemos todo o Brasil via e-commerce."] },
  sustentabilidade: { title: "Sustentabilidade", body: ["Trabalhamos com fornecedores certificados.", "Embalagens recicláveis e logística com compensação de carbono."] },
  carreira: { title: "Carreira", body: ["Envie seu currículo para carreira@chstyle.com.br."] },
  trocas: { title: "Trocas e Devoluções", body: ["Você tem 30 dias para trocar ou devolver.", "Etiqueta postal grátis. Reembolso em até 7 dias úteis."] },
  frete: { title: "Frete e Prazo", body: ["PAC: 5-8 dias úteis.", "SEDEX: 2-3 dias úteis.", "Frete grátis em compras acima de R$299."] },
  pagamento: { title: "Pagamento", body: ["Cartões de crédito em até 4x sem juros.", "PIX com 5% de desconto à vista.", "Boleto bancário disponível."] },
  contato: { title: "Contato", body: ["E-mail: contato@chstyle.com.br", "WhatsApp: (11) 99999-9999", "Atendimento seg-sex 9h-18h."] },
  privacidade: { title: "Política de Privacidade", body: ["Seus dados são tratados com sigilo absoluto.", "Não compartilhamos informações com terceiros."] },
  termos: { title: "Termos de Uso", body: ["Ao usar a CH.Style você concorda com estes termos.", "Conteúdo protegido por direitos autorais."] },
  cookies: { title: "Cookies", body: ["Utilizamos cookies para melhorar sua experiência.", "Você pode gerenciar nas configurações do navegador."] },
  seguranca: { title: "Segurança", body: ["Conexão SSL em todo o site.", "Pagamentos processados com criptografia de ponta."] },
};

export const Route = createFileRoute("/help/$topic")({
  head: ({ params }) => ({ meta: [{ title: `${topics[params.topic]?.title ?? "Ajuda"} — CH.Style` }] }),
  component: HelpPage,
});

function HelpPage() {
  const { topic } = Route.useParams();
  const data = topics[topic] ?? { title: "Página não encontrada", body: ["O conteúdo solicitado não existe."] };

  return (
    <div className="container-ch py-16 md:py-24 max-w-2xl">
      <p className="text-[11px] uppercase tracking-luxury text-gold mb-2">Central de ajuda</p>
      <h1 className="font-display text-3xl md:text-5xl font-bold mb-8">{data.title}</h1>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {data.body.map((p, i) => <p key={i}>{p}</p>)}
      </div>
      <Link to="/" className="inline-block mt-12 border border-gold text-gold px-8 py-4 text-xs uppercase tracking-luxury hover:bg-gold hover:text-primary-foreground transition-colors">
        Voltar à home
      </Link>
    </div>
  );
}
