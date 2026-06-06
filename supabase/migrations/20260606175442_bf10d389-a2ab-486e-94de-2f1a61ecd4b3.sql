GRANT INSERT ON public.payment_settings TO anon, authenticated;
GRANT ALL ON public.payment_settings TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payment_settings'
      AND policyname = 'Anyone can insert payment settings'
  ) THEN
    CREATE POLICY "Anyone can insert payment settings"
    ON public.payment_settings
    FOR INSERT
    TO public
    WITH CHECK (id = 1);
  END IF;
END $$;