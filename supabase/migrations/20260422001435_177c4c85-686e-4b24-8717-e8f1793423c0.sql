CREATE OR REPLACE FUNCTION public.admin_list_email_logs(p_limit int DEFAULT 2000)
RETURNS TABLE (
  id uuid,
  message_id text,
  template_name text,
  recipient_email text,
  status text,
  error_message text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, message_id, template_name, recipient_email, status, error_message, created_at
  FROM public.email_send_log
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.admin_list_email_logs(int) TO anon, authenticated;