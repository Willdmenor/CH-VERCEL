-- Políticas para permitir escrita por usuários autenticados
CREATE POLICY "authenticated_manage_products" ON public.products 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_manage_product_images" ON public.product_images 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_manage_product_variants" ON public.product_variants 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);