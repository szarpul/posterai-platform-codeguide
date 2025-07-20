-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    draft_id UUID REFERENCES public.drafts(id) ON DELETE CASCADE,
    size VARCHAR(10) NOT NULL CHECK (size IN ('A4', 'A3', 'A2')),
    finish VARCHAR(20) NOT NULL CHECK (finish IN ('matte', 'glossy')),
    amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
    shipping_address JSONB NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_production', 'shipped', 'delivered', 'cancelled')),
    payment_intent_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own orders
CREATE POLICY "Users can read own orders" 
    ON public.orders 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own orders
CREATE POLICY "Users can insert own orders" 
    ON public.orders 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own orders
CREATE POLICY "Users can update own orders" 
    ON public.orders 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy to allow service role to manage all orders (for admin functions)
CREATE POLICY "Service role can manage all orders" 
    ON public.orders 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_draft_id_idx ON public.orders(draft_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders(status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role; 