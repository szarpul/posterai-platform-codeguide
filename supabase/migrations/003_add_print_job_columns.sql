-- Add print job related columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS print_job_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS print_job_created_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMPTZ;

-- Add index for print job queries
CREATE INDEX IF NOT EXISTS orders_print_job_id_idx ON public.orders(print_job_id); 