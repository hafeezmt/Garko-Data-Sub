-- =========================================================
-- GARKO DATA SUB - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Paste this script into your Supabase SQL Editor and run it.
-- =========================================================

-- Enable UUID Extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PROFILES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  wallet_balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (wallet_balance >= 0),
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can update own profile (excluding wallet_balance and role)" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles" 
  ON public.profiles FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------
-- 2. TRANSACTIONS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fund_wallet', 'buy_data', 'buy_airtime')),
  network TEXT,
  phone_number TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  plan TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('success', 'pending', 'failed')),
  vtpass_request_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Transactions Policies
CREATE POLICY "Users can view own transactions" 
  ON public.transactions FOR SELECT 
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can insert own transactions" 
  ON public.transactions FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full access to transactions" 
  ON public.transactions FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------
-- 3. DATA PRICES TABLE (Admin Managed)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.data_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  network TEXT NOT NULL, -- 'mtn', 'airtel', 'glo', '9mobile'
  plan_name TEXT NOT NULL,
  vtpass_variation_code TEXT NOT NULL,
  vtpass_price NUMERIC(10, 2) NOT NULL,
  selling_price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.data_prices ENABLE ROW LEVEL SECURITY;

-- Data Prices Policies
CREATE POLICY "Anyone authenticated can view active data prices" 
  ON public.data_prices FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage data prices" 
  ON public.data_prices FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- ---------------------------------------------------------
-- 4. AUTOMATIC PROFILE CREATION TRIGGER
-- ---------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, wallet_balance, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Valued Customer'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    0.00,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------
-- 5. ATOMIC WALLET RPC PROCEDURES
-- ---------------------------------------------------------

-- Function to deduct wallet balance atomically before purchase
CREATE OR REPLACE FUNCTION public.deduct_wallet_balance(
  p_user_id UUID,
  p_amount NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  v_current_balance NUMERIC;
  v_new_balance NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid deduction amount';
  END IF;

  SELECT wallet_balance INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;

  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient wallet balance. Please fund your wallet.';
  END IF;

  v_new_balance := v_current_balance - p_amount;

  UPDATE public.profiles
  SET wallet_balance = v_new_balance
  WHERE id = p_user_id;

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refund wallet balance atomically if VTU fails
CREATE OR REPLACE FUNCTION public.refund_wallet_balance(
  p_user_id UUID,
  p_amount NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  v_new_balance NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid refund amount';
  END IF;

  UPDATE public.profiles
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO v_new_balance;

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to credit wallet balance atomically (Paystack / Admin)
CREATE OR REPLACE FUNCTION public.credit_wallet_balance(
  p_user_id UUID,
  p_amount NUMERIC
) RETURNS NUMERIC AS $$
DECLARE
  v_new_balance NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid credit amount';
  END IF;

  UPDATE public.profiles
  SET wallet_balance = wallet_balance + p_amount
  WHERE id = p_user_id
  RETURNING wallet_balance INTO v_new_balance;

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------
-- 6. SEED DATA PRICES FOR INITIAL SETUP
-- ---------------------------------------------------------
INSERT INTO public.data_prices (network, plan_name, vtpass_variation_code, vtpass_price, selling_price, is_active)
VALUES
  ('mtn', 'MTN 500MB SME (30 Days)', 'mtn-500mb-sme', 140.00, 160.00, true),
  ('mtn', 'MTN 1GB SME (30 Days)', 'mtn-1gb-sme', 270.00, 290.00, true),
  ('mtn', 'MTN 2GB SME (30 Days)', 'mtn-2gb-sme', 540.00, 580.00, true),
  ('mtn', 'MTN 3GB SME (30 Days)', 'mtn-3gb-sme', 810.00, 870.00, true),
  ('mtn', 'MTN 5GB SME (30 Days)', 'mtn-5gb-sme', 1350.00, 1450.00, true),
  ('airtel', 'Airtel 500MB Direct (30 Days)', 'airtel-500mb-dir', 150.00, 170.00, true),
  ('airtel', 'Airtel 1GB Direct (30 Days)', 'airtel-1gb-dir', 290.00, 320.00, true),
  ('airtel', 'Airtel 2GB Direct (30 Days)', 'airtel-2gb-dir', 580.00, 640.00, true),
  ('airtel', 'Airtel 5GB Direct (30 Days)', 'airtel-5gb-dir', 1400.00, 1500.00, true),
  ('glo', 'Glo 1.25GB Special (30 Days)', 'glo-1.25gb', 450.00, 500.00, true),
  ('glo', 'Glo 2.5GB Special (30 Days)', 'glo-2.5gb', 900.00, 1000.00, true),
  ('glo', 'Glo 5.8GB Special (30 Days)', 'glo-5.8gb', 1800.00, 2000.00, true),
  ('9mobile', '9mobile 1GB Data (30 Days)', '9mobile-1gb', 350.00, 400.00, true),
  ('9mobile', '9mobile 2GB Data (30 Days)', '9mobile-2gb', 700.00, 800.00, true),
  ('9mobile', '9mobile 4.5GB Data (30 Days)', '9mobile-4.5gb', 1400.00, 1500.00, true)
ON CONFLICT DO NOTHING;
