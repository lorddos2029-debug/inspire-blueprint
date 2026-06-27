GRANT SELECT, INSERT, UPDATE ON public.rebill_settings TO anon;
GRANT SELECT ON public.rebill_orders TO anon;
CREATE POLICY "rebill_settings anon read" ON public.rebill_settings FOR SELECT TO anon USING (true);
CREATE POLICY "rebill_settings anon update" ON public.rebill_settings FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "rebill_orders anon read" ON public.rebill_orders FOR SELECT TO anon USING (true);