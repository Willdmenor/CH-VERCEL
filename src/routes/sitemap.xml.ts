import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/products";

export const Route = createFileRoute("/sitemap/xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const baseUrl = `${url.protocol}//${url.host}`;
          
          const staticPages = [
            { path: "", priority: "1.0" },
            { path: "products", priority: "0.9" },
            { path: "search", priority: "0.7" },
          ];

          const now = new Date().toISOString();

          let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

          // Static Pages
          for (const page of staticPages) {
            xml += `
  <url>
    <loc>${baseUrl}/${page.path}</loc>
    <lastmod>${now}</lastmod>
    <priority>${page.priority}</priority>
  </url>`;
          }

          // Product Pages
          for (const product of products) {
            xml += `
  <url>
    <loc>${baseUrl}/products/${product.slug}</loc>
    <lastmod>${now}</lastmod>
    <priority>0.8</priority>
  </url>`;
          }

          xml += `
</urlset>`;

          return new Response(xml, {
            headers: {
              "Content-Type": "application/xml",
              "Cache-Control": "public, max-age=3600",
            },
          });
        } catch (err) {
          console.error("[Sitemap Error]", err);
          return new Response("Error generating sitemap", { status: 500 });
        }
      },
    },
  },
});