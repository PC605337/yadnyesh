-- Add payment transactions table for comprehensive payment tracking
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  provider_id UUID,
  appointment_id UUID,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('consultation', 'prescription', 'lab_test', 'insurance_claim', 'wallet_topup', 'refund')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'netbanking', 'wallet', 'cash', 'insurance')),
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  transaction_id TEXT UNIQUE NOT NULL,
  gateway_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('razorpay', 'payu', 'phonepe', 'googlepay', 'paytm')),
  gateway_response JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment transactions
CREATE POLICY "Users can view their own payment transactions" 
ON public.payment_transactions 
FOR SELECT 
USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create their own payment transactions" 
ON public.payment_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Providers can view their payment transactions" 
ON public.payment_transactions 
FOR UPDATE 
USING (auth.uid() = provider_id);

-- Add digital wallet table
CREATE TABLE IF NOT EXISTS public.digital_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0 CHECK (balance >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  wallet_status TEXT NOT NULL DEFAULT 'active' CHECK (wallet_status IN ('active', 'suspended', 'blocked')),
  daily_limit NUMERIC DEFAULT 50000,
  monthly_limit NUMERIC DEFAULT 200000,
  kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  kyc_documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.digital_wallets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for digital wallets
CREATE POLICY "Users can view their own wallet" 
ON public.digital_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet" 
ON public.digital_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" 
ON public.digital_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add wallet transactions table
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'refund', 'cashback')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  balance_after NUMERIC NOT NULL CHECK (balance_after >= 0),
  description TEXT NOT NULL,
  reference_id UUID, -- Reference to payment_transaction or other entity
  reference_type TEXT CHECK (reference_type IN ('payment', 'topup', 'refund', 'cashback', 'transfer')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wallet transactions
CREATE POLICY "Users can view their own wallet transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add payment links table for one-tap payments
CREATE TABLE IF NOT EXISTS public.payment_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  patient_id UUID,
  link_id TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL CHECK (service_type IN ('teleconsult', 'lab_test', 'hospital_visit', 'prescription', 'health_checkup')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  description TEXT NOT NULL,
  qr_code_url TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  payment_transaction_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment links
CREATE POLICY "Providers can manage their payment links" 
ON public.payment_links 
FOR ALL 
USING (auth.uid() = provider_id);

CREATE POLICY "Public can view active payment links" 
ON public.payment_links 
FOR SELECT 
USING (status = 'active' AND expires_at > NOW());

CREATE POLICY "Patients can view their payment links" 
ON public.payment_links 
FOR SELECT 
USING (auth.uid() = patient_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_transactions_patient_id ON public.payment_transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_provider_id ON public.payment_transactions(provider_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON public.payment_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_payment_links_provider_id ON public.payment_links(provider_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_link_id ON public.payment_links(link_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_digital_wallets_updated_at BEFORE UPDATE ON public.digital_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_links_updated_at BEFORE UPDATE ON public.payment_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();