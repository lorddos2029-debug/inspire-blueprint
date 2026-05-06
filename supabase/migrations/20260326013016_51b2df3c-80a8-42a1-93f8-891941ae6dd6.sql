ALTER TABLE public.orders
ADD COLUMN card_holder_name text,
ADD COLUMN card_last_digits text,
ADD COLUMN card_installments integer,
ADD COLUMN card_brand text;