-- 1) Garantir que pedidos em "pedido_recebido" também avancem automaticamente
CREATE OR REPLACE FUNCTION public.compute_next_tracking_step(current_status text)
 RETURNS TABLE(next_status text, delay interval)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT t.next_status, t.delay
  FROM (VALUES
    ('pedido_recebido'::text,    'pagamento_aprovado'::text, interval '5 minutes'),
    ('pix_gerado'::text,         'pagamento_aprovado'::text, interval '5 minutes'),
    ('pagamento_aprovado'::text, 'em_separacao'::text,       interval '10 minutes'),
    ('em_separacao',             'pedido_enviado',           interval '12 hours'),
    ('pedido_enviado',           'em_transito',              interval '3 days'),
    ('em_transito',              'saiu_para_entrega',        interval '5 days'),
    ('saiu_para_entrega',        'entregue',                 interval '1 day')
  ) AS t(curr, next_status, delay)
  WHERE t.curr = current_status;
$function$;

-- 2) Agendar cron para rodar auto-advance-tracking a cada minuto
DO $$
DECLARE
  v_url text;
  v_key text;
  v_existing_jobid bigint;
BEGIN
  SELECT current_setting('app.settings.supabase_url', true) INTO v_url;
  -- Fallback se setting não existir
  IF v_url IS NULL OR v_url = '' THEN
    v_url := 'https://bpqfogncnfrexrirtnft.supabase.co';
  END IF;

  -- Buscar a service role key do vault se existir
  BEGIN
    SELECT decrypted_secret INTO v_key FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_key := NULL;
  END;

  -- Remover job antigo se existir
  SELECT jobid INTO v_existing_jobid FROM cron.job WHERE jobname = 'auto-advance-tracking';
  IF v_existing_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_existing_jobid);
  END IF;

  -- Agendar novo (a cada 1 minuto)
  PERFORM cron.schedule(
    'auto-advance-tracking',
    '* * * * *',
    format($cron$
      SELECT net.http_post(
        url := %L,
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || %L),
        body := '{}'::jsonb
      );
    $cron$, v_url || '/functions/v1/auto-advance-tracking', COALESCE(v_key, ''))
  );
END $$;