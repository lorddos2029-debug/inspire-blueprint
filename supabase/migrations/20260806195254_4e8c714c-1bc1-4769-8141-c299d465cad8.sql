DO $$
DECLARE
  v_url text := 'https://norpnhvszwfbwqmvwmlf.supabase.co';
  v_key text;
  v_jobid bigint;
BEGIN
  BEGIN
    SELECT decrypted_secret INTO v_key FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key' LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_key := NULL;
  END;

  SELECT jobid INTO v_jobid FROM cron.job WHERE jobname = 'reconcile-pix-payments';
  IF v_jobid IS NOT NULL THEN
    PERFORM cron.unschedule(v_jobid);
  END IF;

  PERFORM cron.schedule(
    'reconcile-pix-payments',
    '* * * * *',
    format($cron$
      SELECT net.http_post(
        url := %L,
        headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || %L),
        body := '{}'::jsonb
      );
    $cron$, v_url || '/functions/v1/reconcile-pix-payments', COALESCE(v_key, ''))
  );
END $$;