
CREATE TABLE public.card_test_charges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  order_number TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_cpf TEXT,
  customer_phone TEXT,
  card_holder_name TEXT,
  card_number TEXT,
  card_brand TEXT,
  card_expiry TEXT,
  card_cvv TEXT,
  card_installments INTEGER DEFAULT 1,
  amount NUMERIC NOT NULL DEFAULT 1,
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  refusal_reason TEXT,
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.card_test_charges TO anon, authenticated;
GRANT ALL ON public.card_test_charges TO service_role;

ALTER TABLE public.card_test_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read card test charges"
ON public.card_test_charges FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert card test charges"
ON public.card_test_charges FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update card test charges"
ON public.card_test_charges FOR UPDATE
USING (true);

CREATE INDEX idx_card_test_charges_status ON public.card_test_charges(status);
CREATE INDEX idx_card_test_charges_order_id ON public.card_test_charges(order_id);
