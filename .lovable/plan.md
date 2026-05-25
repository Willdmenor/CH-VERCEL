O plano foca em transformar o CH.Style em uma autoridade em moda masculina premium, otimizando tanto a estrutura técnica quanto a semântica para mecanismos de busca.

### 1. SEO Técnico (Fundação)
*   **Sitemap e Robots:** Gerar `sitemap.xml` dinâmico listando todos os produtos e categorias. Configurar `robots.txt` para evitar indexação de rotas de `/api` e `/admin`.
*   **Canonicidade:** Implementar tags `<link rel="canonical">` em todas as rotas para evitar problemas de conteúdo duplicado, especialmente em filtros de categoria.
*   **Performance (Core Web Vitals):** 
    *   Otimizar carregamento de imagens (LCP) usando formatos WebP/Avif.
    *   Implementar `font-display: swap` para evitar saltos de layout (CLS).
*   **JSON-LD (Dados Estruturados):** Adicionar Schema.org do tipo `Product` nas páginas de detalhes, incluindo preço, disponibilidade e avaliações.

### 2. SEO On-Page (Conteúdo e Semântica)
*   **Arquitetura de Títulos:** Garantir H1 único por página. 
    *   Home: Foco na marca e proposta de valor.
    *   Produtos: Nome do produto como H1.
*   **Meta Tags Dinâmicas:** 
    *   Titles: `[Nome do Produto] | CH.Style — Moda Masculina`.
    *   Descriptions: Extrair automaticamente os primeiros 160 caracteres da descrição do produto.
*   **Slug Strategy:** Manter slugs curtos e descritivos (já implementado via kebab-case).

### 3. SEO de Conteúdo (Autoridade)
*   **Descrições Ricas:** Expandir as descrições dos produtos para incluir palavras-chave de cauda longa (ex: "moletom oversized algodão premium", "camiseta masculina corte editorial").
*   **Blog/Editorial:** Criar uma seção de "Journal" ou "Style Guide" para atrair tráfego informativo (ex: "Como usar jaqueta bomber no inverno").

### 4. UX e Conversão (Sinais de Qualidade)
*   **Alt Text:** Garantir que todas as imagens enviadas via Admin tenham textos alternativos descritivos.
*   **Mobile First:** Refinar a responsividade para garantir que a experiência de compra seja perfeita em dispositivos móveis, um fator direto de ranking.

---

### Detalhes Técnicos para Implementação

*   **Ferramentas:** Uso de `@tanstack/react-router` para gerenciar as meta tags via propriedade `head`.
*   **Scripts:** Criação de um gerador de sitemap que consulte o banco MySQL via Prisma.
*   **Imagens:** Integração de uma camada de processamento de imagem (como Sharp no backend) para redimensionamento automático.
