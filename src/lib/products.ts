
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  imageHover?: string;
  badge?: "novo" | "bestseller" | "promo";
  sizes: string[];
  colors: { name: string; hex: string }[];
  description: string;
};

export const products: Product[] = [
  {
    id: "1", slug: "camiseta-essential-noir", name: "Camiseta Essential Noir",
    category: "Camisetas", price: 189, oldPrice: 249, image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675728840-a06fec54-24a4-45b1-be18-902d94e51006.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675729669-4fbba7a0-f612-4ddf-9e37-a596e349b876.png",
    badge: "bestseller", sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }, { name: "Carvão", hex: "#2d2d2d" }],
    description: "Algodão pima premium com caimento perfeito. Costura reforçada e acabamento editorial.",
  },
  {
    id: "2", slug: "moletom-signature-gold", name: "Moletom Signature Gold",
    category: "Moletons", price: 449, 
    image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675949964-073d89e2-5038-4228-9810-421a25bb984f.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675949971-f1b16e80-e94a-4528-bd27-c202cbf82729.png",
    badge: "novo", sizes: ["P", "M", "G", "GG"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }],
    description: "Moletom oversized com bordado dourado discreto. Felpa interna de alta gramatura.",
  },
  {
    id: "3", slug: "jaqueta-bomber-onyx", name: "Jaqueta Bomber Onyx",
    category: "Jaquetas", price: 899, oldPrice: 1199, 
    image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675950847-0080dfe7-fbcb-45ca-99d3-a4bc9512a6a6.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675950881-f7a35b00-acee-4def-ac3e-34a73535666e.png",
    badge: "promo", sizes: ["M", "G", "GG"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }],
    description: "Bomber em sarja de alta qualidade. Forro acetinado e zíperes em metal escovado.",
  },
  {
    id: "4", slug: "tenis-low-leather", name: "Tênis Low Leather",
    category: "Calçados", price: 749, 
    image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675951618-a77a8a10-f8b2-425b-8ed1-88f14e9a5553.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675951969-3c78ff48-afd2-4718-a298-f70f9b9d7ba4.png",
    badge: "bestseller", sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }],
    description: "Couro genuíno italiano com solado em borracha vulcanizada. Conforto e elegância.",
  },
  {
    id: "5", slug: "calca-cargo-shadow", name: "Calça Cargo Shadow",
    category: "Calças", price: 389, 
    image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675952235-05ce0ff6-bd8d-4e36-8a5a-4be083e925af.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675952611-701ac733-3720-4978-ace6-93cc1a8ee2eb.png",
    sizes: ["38", "40", "42", "44", "46"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }, { name: "Carvão", hex: "#2d2d2d" }],
    description: "Modelagem reta com bolsos cargo funcionais. Tecido encorpado com toque macio.",
  },
  {
    id: "6", slug: "bone-monogram", name: "Boné Monogram",
    category: "Acessórios", price: 159, 
    image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675953213-1cb89d88-a403-49d5-8081-5e61d9e501a7.png", 
    imageHover: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675953253-d2f56c24-32f4-45f1-81f4-ffdc5e4bce2e.png",
    badge: "novo", sizes: ["Único"],
    colors: [{ name: "Preto", hex: "#0d0d0d" }],
    description: "Boné estruturado com bordado monogram em fio metálico dourado.",
  },
];

export const categories = [
  { slug: "camisetas", name: "Camisetas", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675728840-a06fec54-24a4-45b1-be18-902d94e51006.png" },
  { slug: "moletons", name: "Moletons", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675949964-073d89e2-5038-4228-9810-421a25bb984f.png" },
  { slug: "jaquetas", name: "Jaquetas", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675950847-0080dfe7-fbcb-45ca-99d3-a4bc9512a6a6.png" },
  { slug: "calcados", name: "Calçados", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675951618-a77a8a10-f8b2-425b-8ed1-88f14e9a5553.png" },
  { slug: "calcas", name: "Calças", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675952235-05ce0ff6-bd8d-4e36-8a5a-4be083e925af.png" },
  { slug: "acessorios", name: "Acessórios", image: "https://ynvrijkuampxpsmshftm.supabase.co/storage/v1/object/public/prompt-images/uploads/1779675953213-1cb89d88-a403-49d5-8081-5e61d9e501a7.png" },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
