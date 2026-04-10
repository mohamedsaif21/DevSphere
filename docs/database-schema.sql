-- Create saved_codes table for storing user code snippets
CREATE TABLE IF NOT EXISTS public.saved_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_codes_user_id ON public.saved_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_codes_created_at ON public.saved_codes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.saved_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see their own saved codes
CREATE POLICY "Users can view own saved codes" ON public.saved_codes
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own saved codes
CREATE POLICY "Users can insert own saved codes" ON public.saved_codes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved codes
CREATE POLICY "Users can update own saved codes" ON public.saved_codes
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own saved codes
CREATE POLICY "Users can delete own saved codes" ON public.saved_codes
  FOR DELETE USING (auth.uid() = user_id);
