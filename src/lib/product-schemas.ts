// Schemas Zod compartilhados para Product
import { z } from "zod";

export const ProductImageInput = z.object({
  url: z.string().min(1, "URL da imagem é obrigatória"),
  alt: z.string().optional().nullable(),
  position: z.number().int().min(0).default(0),
});

export const ProductVariantInput = z.object({
  color: z.string().min(1, "Cor é obrigatória").max(50),
  size: z.string().min(1, "Tamanho é obrigatório").max(20),
  stock: z.number().int().min(0).default(0),
  sku: z.string().max(64).optional().nullable(),
});

export const ProductCreateSchema = z.object({
  slug: z.string().min(1, "Slug é obrigatório").max(120).regex(/^[a-z0-9-]+$/, "slug deve ser kebab-case"),
  name: z.string().min(1, "Nome é obrigatório").max(200),
  description: z.string().min(1, "Descrição é obrigatória").max(5000),
  priceCents: z.number().int().min(1, "Preço deve ser maior que zero"),
  category: z.string().min(1, "Categoria é obrigatória").max(80),
  active: z.boolean().default(true),
  images: z.array(ProductImageInput).max(20).optional(),
  variants: z.array(ProductVariantInput).min(1, "Adicione pelo menos uma variante (tamanho/cor)").max(100).optional(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

export const ProductListQuery = z.object({
  category: z.string().max(80).optional(),
  active: z.enum(["true", "false"]).optional(),
  search: z.string().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductCreateInput = z.infer<typeof ProductCreateSchema>;
export type ProductUpdateInput = z.infer<typeof ProductUpdateSchema>;
