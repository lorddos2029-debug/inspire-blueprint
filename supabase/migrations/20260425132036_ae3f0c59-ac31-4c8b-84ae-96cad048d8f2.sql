ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS pix_code text,
  ADD COLUMN IF NOT EXISTS pix_qr_image text,
  ADD COLUMN IF NOT EXISTS pix_expires_at timestamp with time zone;