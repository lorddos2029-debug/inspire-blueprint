-- Add product/page tracking to checkout_events
ALTER TABLE public.checkout_events
  ADD COLUMN IF NOT EXISTS product_id text,
  ADD COLUMN IF NOT EXISTS page text;

CREATE INDEX IF NOT EXISTS checkout_events_product_id_idx ON public.checkout_events(product_id);
CREATE INDEX IF NOT EXISTS checkout_events_created_at_idx ON public.checkout_events(created_at DESC);

-- Live sessions table (heartbeat-based presence)
CREATE TABLE IF NOT EXISTS public.live_sessions (
  session_id text PRIMARY KEY,
  last_seen timestamptz NOT NULL DEFAULT now(),
  page text,
  product_id text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS live_sessions_last_seen_idx ON public.live_sessions(last_seen DESC);

ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can upsert their session"
  ON public.live_sessions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update their session"
  ON public.live_sessions FOR UPDATE
  TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can read live sessions"
  ON public.live_sessions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete stale sessions"
  ON public.live_sessions FOR DELETE
  TO anon, authenticated
  USING (last_seen < now() - interval '5 minutes');