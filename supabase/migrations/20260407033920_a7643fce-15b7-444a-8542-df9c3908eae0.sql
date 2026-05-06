CREATE TABLE public.checkout_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  session_id text NOT NULL,
  step text NOT NULL
);

ALTER TABLE public.checkout_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.checkout_events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anonymous select" ON public.checkout_events FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated inserts" ON public.checkout_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated select" ON public.checkout_events FOR SELECT TO authenticated USING (true);