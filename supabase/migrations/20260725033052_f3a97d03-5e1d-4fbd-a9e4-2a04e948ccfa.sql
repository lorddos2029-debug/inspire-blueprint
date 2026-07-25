ALTER TABLE public.payment_settings ADD COLUMN IF NOT EXISTS card_provider text DEFAULT 'payout';

-- No need for new GRANTs if they were already granted for the table. 
-- authenticated should have access to this table as per user-roles instructions.
