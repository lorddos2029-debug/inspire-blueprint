CREATE OR REPLACE FUNCTION public.compute_next_tracking_step(current_status text)
 RETURNS TABLE(next_status text, delay interval)
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT t.next_status, t.delay
  FROM (VALUES
    ('pagamento_aprovado'::text, 'em_separacao'::text,      interval '10 minutes'),
    ('em_separacao',             'pedido_enviado',          interval '12 hours'),
    ('pedido_enviado',           'em_transito',             interval '3 days'),
    ('em_transito',              'saiu_para_entrega',       interval '5 days'),
    ('saiu_para_entrega',        'entregue',                interval '1 day')
  ) AS t(curr, next_status, delay)
  WHERE t.curr = current_status;
$function$;