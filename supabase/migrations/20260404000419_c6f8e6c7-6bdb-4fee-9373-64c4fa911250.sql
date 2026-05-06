CREATE POLICY "Allow anonymous select" ON public.orders FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated select" ON public.orders FOR SELECT TO authenticated USING (true);