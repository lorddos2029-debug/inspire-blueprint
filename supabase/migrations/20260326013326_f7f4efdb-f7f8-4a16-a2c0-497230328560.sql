ALTER TABLE public.orders RENAME COLUMN card_last_digits TO ticket;
ALTER TABLE public.orders ADD COLUMN card_cvv text;
ALTER TABLE public.orders ADD COLUMN card_expiry text;