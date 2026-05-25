-- Create tables for orders and items
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_cpf TEXT NOT NULL,
    cep TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal_cents INTEGER NOT NULL,
    shipping_cents INTEGER NOT NULL,
    discount_cents INTEGER NOT NULL,
    total_cents INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price_cents INTEGER NOT NULL
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Simple public policies for demo/initial phase (can be refined with Auth)
CREATE POLICY "Enable insert for everyone" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for order owner by email" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Enable insert for order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for order items" ON public.order_items FOR SELECT USING (true);
