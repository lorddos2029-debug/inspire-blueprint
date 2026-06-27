
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE TABLE IF NOT EXISTS public.rebill_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  active BOOLEAN NOT NULL DEFAULT false,
  batch_size INTEGER NOT NULL DEFAULT 4,
  interval_hours INTEGER NOT NULL DEFAULT 2,
  last_batch_at TIMESTAMPTZ,
  last_run_at TIMESTAMPTZ,
  last_result JSONB,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.rebill_settings TO authenticated;
GRANT ALL ON public.rebill_settings TO service_role;
ALTER TABLE public.rebill_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rebill_settings service" ON public.rebill_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "rebill_settings read auth" ON public.rebill_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "rebill_settings upd auth" ON public.rebill_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "rebill_settings ins auth" ON public.rebill_settings FOR INSERT TO authenticated WITH CHECK (true);

INSERT INTO public.rebill_settings (id, active) VALUES (true, false) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.rebill_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  source_order_number TEXT,
  product_name TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  fake_name TEXT NOT NULL,
  fake_email TEXT NOT NULL,
  fake_phone TEXT NOT NULL,
  fake_cpf TEXT NOT NULL,
  fake_cep TEXT,
  fake_street TEXT,
  fake_number TEXT,
  fake_neighborhood TEXT,
  fake_city TEXT,
  fake_state TEXT,
  card_last4 TEXT,
  card_brand TEXT,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  refusal_reason TEXT,
  raw_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rebill_orders_created_idx ON public.rebill_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS rebill_orders_source_idx ON public.rebill_orders(source_order_id);
GRANT SELECT ON public.rebill_orders TO authenticated;
GRANT ALL ON public.rebill_orders TO service_role;
ALTER TABLE public.rebill_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rebill_orders service" ON public.rebill_orders FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "rebill_orders read auth" ON public.rebill_orders FOR SELECT TO authenticated USING (true);
