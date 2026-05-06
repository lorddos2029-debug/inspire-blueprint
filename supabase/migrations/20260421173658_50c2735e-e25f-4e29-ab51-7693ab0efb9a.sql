-- Add tracking columns to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS tracking_status TEXT NOT NULL DEFAULT 'pedido_recebido';

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON public.orders(tracking_code);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(lower(customer_email));

-- Status history table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id
  ON public.order_status_history(order_id, created_at DESC);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Public read for tracking page (history shown only via order lookup)
DROP POLICY IF EXISTS "Anyone can read status history" ON public.order_status_history;
CREATE POLICY "Anyone can read status history"
  ON public.order_status_history FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can insert status history" ON public.order_status_history;
CREATE POLICY "Anyone can insert status history"
  ON public.order_status_history FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow updating orders for status/tracking changes (admin panel)
DROP POLICY IF EXISTS "Allow anonymous update orders" ON public.orders;
CREATE POLICY "Allow anonymous update orders"
  ON public.orders FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Function to generate order_number and tracking_code on insert
CREATE OR REPLACE FUNCTION public.set_order_identifiers()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rand_digits TEXT;
BEGIN
  IF NEW.order_number IS NULL THEN
    rand_digits := LPAD(FLOOR(random() * 100000000)::TEXT, 8, '0');
    NEW.order_number := 'AO' || rand_digits;
  END IF;
  IF NEW.tracking_code IS NULL THEN
    rand_digits := LPAD(FLOOR(random() * 1000000000)::TEXT, 9, '0');
    NEW.tracking_code := 'LV' || rand_digits || 'BR';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_identifiers ON public.orders;
CREATE TRIGGER trg_set_order_identifiers
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_identifiers();

-- Trigger to auto-log status changes into order_status_history
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.order_status_history (order_id, status, note)
    VALUES (NEW.id, NEW.tracking_status, 'Pedido criado');
  ELSIF TG_OP = 'UPDATE' AND NEW.tracking_status IS DISTINCT FROM OLD.tracking_status THEN
    INSERT INTO public.order_status_history (order_id, status, note)
    VALUES (NEW.id, NEW.tracking_status, 'Status atualizado');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_log_order_status_change ON public.orders;
CREATE TRIGGER trg_log_order_status_change
  AFTER INSERT OR UPDATE OF tracking_status ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.log_order_status_change();