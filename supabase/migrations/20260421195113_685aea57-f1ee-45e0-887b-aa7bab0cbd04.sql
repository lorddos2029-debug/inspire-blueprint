ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pix_reminder_sent_at timestamptz;
CREATE INDEX IF NOT EXISTS idx_orders_pix_reminder_lookup
  ON public.orders (created_at)
  WHERE payment_status = 'pending' AND pix_reminder_sent_at IS NULL;