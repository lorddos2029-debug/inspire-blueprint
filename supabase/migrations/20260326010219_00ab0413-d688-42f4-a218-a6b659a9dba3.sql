CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_cpf text NOT NULL,
  cep text NOT NULL,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  shipping_method text NOT NULL,
  shipping_cost numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  transaction_id text,
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated inserts" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);