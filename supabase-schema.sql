-- =============================================================================
-- SUPABASE DATABASE SCHEMA FOR CREATOR PAYMENT PLATFORM
-- =============================================================================
-- This SQL file sets up the database schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/[your-project]/sql-editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE transaction_type AS ENUM ('donation', 'payment_link', 'payment_request');
CREATE TYPE transaction_status AS ENUM ('completed', 'pending', 'failed');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE payout_method AS ENUM ('bank_transfer', 'paypal', 'stripe');
CREATE TYPE payment_link_status AS ENUM ('active', 'inactive', 'expired');
CREATE TYPE payment_request_status AS ENUM ('pending', 'accepted', 'rejected');

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tagline TEXT,
  bio TEXT,
  profile_image_url TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  description TEXT,
  from_user_id UUID REFERENCES public.users(id),
  from_user_username TEXT,
  from_user_profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  status payout_status NOT NULL DEFAULT 'pending',
  method payout_method NOT NULL,
  external_id TEXT, -- ID from payment processor (Stripe, PayPal, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Payment Links table
CREATE TABLE IF NOT EXISTS public.payment_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  reference TEXT UNIQUE NOT NULL,
  description TEXT,
  share_url TEXT NOT NULL,
  logo_url TEXT,
  customer_redirect_url TEXT,
  customer_fail_redirect_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  status payment_link_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Requests table
CREATE TABLE IF NOT EXISTS public.payment_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  recipient_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  reason TEXT NOT NULL,
  status payment_request_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON public.payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON public.payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON public.payouts(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_links_user_id ON public.payment_links(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_reference ON public.payment_links(reference);

CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON public.payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON public.payment_requests(status);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_requests ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public user profiles" ON public.users
  FOR SELECT USING (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions" ON public.transactions
  FOR ALL USING (auth.role() = 'service_role');

-- Payouts policies
CREATE POLICY "Users can view their own payouts" ON public.payouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payouts" ON public.payouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all payouts" ON public.payouts
  FOR ALL USING (auth.role() = 'service_role');

-- Payment Links policies
CREATE POLICY "Users can view their own payment links" ON public.payment_links
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own payment links" ON public.payment_links
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active payment links" ON public.payment_links
  FOR SELECT USING (status = 'active');

-- Payment Requests policies
CREATE POLICY "Users can view their own payment requests" ON public.payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create payment requests" ON public.payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment requests" ON public.payment_requests
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_earnings', COALESCE((
      SELECT SUM(amount) 
      FROM transactions 
      WHERE user_id = user_uuid 
      AND status = 'completed'
    ), 0),
    'today_earnings', COALESCE((
      SELECT SUM(amount) 
      FROM transactions 
      WHERE user_id = user_uuid 
      AND status = 'completed'
      AND DATE(created_at) = CURRENT_DATE
    ), 0),
    'pending_payouts', COALESCE((
      SELECT SUM(amount) 
      FROM payouts 
      WHERE user_id = user_uuid 
      AND status IN ('pending', 'processing')
    ), 0),
    'total_transactions', COALESCE((
      SELECT COUNT(*) 
      FROM transactions 
      WHERE user_id = user_uuid
    ), 0)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substring(NEW.id::text, 1, 8)),
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Trigger to create user profile when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;

-- Insert sample data (optional - for development)
-- This can be used for testing
/*
INSERT INTO public.users (id, username, email, tagline, bio, social_links) VALUES
('00000000-0000-0000-0000-000000000001', 'demo_creator', 'demo@example.com', 'Content Creator | Digital Artist', 'I create amazing digital content!', '{"twitter": "@demo_creator", "instagram": "@demo_creator"}'::jsonb);

INSERT INTO public.transactions (user_id, amount, type, status, description, from_user_username) VALUES
('00000000-0000-0000-0000-000000000001', 25.50, 'donation', 'completed', 'Thank you for the awesome content!', 'fan123'),
('00000000-0000-0000-0000-000000000001', 15.00, 'payment_link', 'completed', 'Custom artwork request', 'artlover');

INSERT INTO public.payouts (user_id, amount, status, method) VALUES
('00000000-0000-0000-0000-000000000001', 35.50, 'completed', 'bank_transfer');

INSERT INTO public.payment_links (user_id, name, currency, reference, description, share_url) VALUES
('00000000-0000-0000-0000-000000000001', 'Custom Art Commission', 'USD', 'CUSTOM-ART', 'Commission me for custom digital artwork', 'https://payments.example.com/l/custom-art');
*/
