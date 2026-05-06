ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS auto_next_status text,
  ADD COLUMN IF NOT EXISTS auto_next_at timestamptz,
  ADD COLUMN IF NOT EXISTS auto_advance_enabled boolean NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_orders_auto_next_at
  ON public.orders (auto_next_at)
  WHERE auto_next_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.compute_next_tracking_step(current_status text)
RETURNS TABLE(next_status text, delay interval)
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT t.next_status, t.delay
  FROM (VALUES
    ('pagamento_aprovado'::text, 'em_separacao'::text,      interval '6 hours'),
    ('em_separacao',             'pedido_enviado',          interval '12 hours'),
    ('pedido_enviado',           'em_transito',             interval '3 days'),
    ('em_transito',              'saiu_para_entrega',       interval '5 days'),
    ('saiu_para_entrega',        'entregue',                interval '1 day')
  ) AS t(curr, next_status, delay)
  WHERE t.curr = current_status;
$$;

CREATE OR REPLACE FUNCTION public.schedule_next_tracking_step()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_next text;
  v_delay interval;
BEGIN
  IF NEW.auto_advance_enabled = false THEN
    NEW.auto_next_status := NULL;
    NEW.auto_next_at := NULL;
    RETURN NEW;
  END IF;

  IF (TG_OP = 'INSERT')
     OR (TG_OP = 'UPDATE' AND NEW.tracking_status IS DISTINCT FROM OLD.tracking_status)
     OR (TG_OP = 'UPDATE' AND NEW.auto_advance_enabled IS DISTINCT FROM OLD.auto_advance_enabled) THEN
    SELECT s.next_status, s.delay INTO v_next, v_delay
    FROM public.compute_next_tracking_step(NEW.tracking_status) s;

    IF v_next IS NOT NULL THEN
      NEW.auto_next_status := v_next;
      NEW.auto_next_at := now() + v_delay;
    ELSE
      NEW.auto_next_status := NULL;
      NEW.auto_next_at := NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_schedule_next_tracking_step ON public.orders;
CREATE TRIGGER trg_schedule_next_tracking_step
BEFORE INSERT OR UPDATE OF tracking_status, auto_advance_enabled ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.schedule_next_tracking_step();