
-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price_cents INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.products (category);
CREATE INDEX ON public.products (active);

CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  position INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX ON public.product_images (product_id);

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT UNIQUE,
  UNIQUE (product_id, color, size)
);
CREATE INDEX ON public.product_variants (product_id);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Public read (catalog is public). Writes are server-side via service role (bypasses RLS).
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "product_images_public_read" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "product_variants_public_read" ON public.product_variants FOR SELECT USING (true);
