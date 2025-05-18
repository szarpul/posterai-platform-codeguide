-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create drafts table
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies for drafts
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own drafts
CREATE POLICY "Users can read own drafts" 
    ON public.drafts 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy to allow users to insert their own drafts
CREATE POLICY "Users can insert own drafts" 
    ON public.drafts 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own drafts
CREATE POLICY "Users can update own drafts" 
    ON public.drafts 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Policy to allow users to delete their own drafts
CREATE POLICY "Users can delete own drafts" 
    ON public.drafts 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_drafts_updated_at
    BEFORE UPDATE ON public.drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS drafts_user_id_idx ON public.drafts(user_id);
CREATE INDEX IF NOT EXISTS drafts_created_at_idx ON public.drafts(created_at DESC);

-- Grant necessary permissions
GRANT ALL ON public.drafts TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 