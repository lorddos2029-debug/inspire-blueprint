
CREATE TABLE public.payment_settings (
  id integer PRIMARY KEY DEFAULT 1,
  pix_provider text NOT NULL DEFAULT 'payout',
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT payment_settings_singleton CHECK (id = 1),
  CONSTRAINT payment_settings_provider_check CHECK (pix_provider IN ('payout','primecash'))
);

INSERT INTO public.payment_settings (id, pix_provider) VALUES (1, 'payout')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read payment settings"
  ON public.payment_settings FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update payment settings"
  ON public.payment_settings FOR UPDATE
  USING (true) WITH CHECK (true);
