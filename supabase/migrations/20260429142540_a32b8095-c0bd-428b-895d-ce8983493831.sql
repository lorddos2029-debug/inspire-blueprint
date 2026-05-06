CREATE TABLE public.upsell_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  step_id text NOT NULL,
  kind text NOT NULL,
  event text NOT NULL,
  product_name text,
  price numeric DEFAULT 0,
  session_id text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_upsell_events_step ON public.upsell_events(step_id);
CREATE INDEX idx_upsell_events_event ON public.upsell_events(event);
CREATE INDEX idx_upsell_events_created ON public.upsell_events(created_at DESC);

ALTER TABLE public.upsell_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert upsell events"
  ON public.upsell_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read upsell events"
  ON public.upsell_events FOR SELECT
  TO anon, authenticated
  USING (true);