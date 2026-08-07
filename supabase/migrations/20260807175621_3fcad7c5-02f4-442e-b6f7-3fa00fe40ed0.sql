SELECT cron.schedule('reconcile-card-payments-job', '* * * * *', $$
  SELECT net.http_post(
    url := (SELECT value FROM vault.decrypted_secrets WHERE name = 'supabase_url') || '/functions/v1/reconcile-card-payments',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT value FROM vault.decrypted_secrets WHERE name = 'email_queue_service_role_key')
    ),
    body := '{}'
  );
$$);