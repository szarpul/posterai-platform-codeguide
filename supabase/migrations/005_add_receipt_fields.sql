-- Add receipt fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS receipt_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS receipt_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS receipt_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS receipt_url TEXT;

-- Add index for receipt queries
CREATE INDEX IF NOT EXISTS orders_receipt_sent_at_idx ON public.orders(receipt_sent_at);

-- Add comment for documentation
COMMENT ON COLUMN public.orders.receipt_sent_at IS 'Timestamp when payment receipt was sent';
COMMENT ON COLUMN public.orders.receipt_id IS 'Stripe receipt/charge ID';
COMMENT ON COLUMN public.orders.receipt_number IS 'Receipt number for customer reference';
COMMENT ON COLUMN public.orders.receipt_url IS 'URL to Stripe receipt page';
