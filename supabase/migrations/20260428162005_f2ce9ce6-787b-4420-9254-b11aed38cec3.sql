UPDATE public.orders
SET tracking_status = 'pedido_enviado'
WHERE payment_status = 'paid'
  AND tracking_status IN ('pedido_recebido','pix_gerado','pagamento_aprovado','em_separacao')
  AND created_at < now() - interval '6 hours';