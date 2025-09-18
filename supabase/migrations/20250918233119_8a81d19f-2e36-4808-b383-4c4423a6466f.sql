-- Create provider verification tables
CREATE TABLE IF NOT EXISTS public.provider_verification_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL,
  nmr_id TEXT NOT NULL,
  license_number TEXT NOT NULL,  
  specializations TEXT[] NOT NULL DEFAULT '{}',
  medical_college TEXT NOT NULL,
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  documents JSONB DEFAULT '{}', -- Store document URLs and metadata
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'in_review', 'verified', 'rejected', 'incomplete')),
  nmr_verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (nmr_verification_status IN ('pending', 'verified', 'failed', 'not_found')),
  nmr_response_data JSONB DEFAULT '{}',
  admin_notes TEXT,
  verified_by UUID,
  verification_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.provider_verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Providers can view their own verification requests" 
ON public.provider_verification_requests 
FOR SELECT 
USING (auth.uid() = provider_id);

CREATE POLICY "Providers can create their own verification requests" 
ON public.provider_verification_requests 
FOR INSERT 
WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update their pending requests" 
ON public.provider_verification_requests 
FOR UPDATE 
USING (auth.uid() = provider_id AND verification_status IN ('pending', 'incomplete'));

-- Create verification documents table
CREATE TABLE IF NOT EXISTS public.verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verification_request_id UUID NOT NULL REFERENCES public.provider_verification_requests(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('medical_license', 'nmr_certificate', 'degree_certificate', 'experience_certificate', 'photo_id', 'practice_certificate')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS for documents
ALTER TABLE public.verification_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents
CREATE POLICY "Providers can manage documents for their verification requests" 
ON public.verification_documents 
FOR ALL 
USING (
  verification_request_id IN (
    SELECT id FROM public.provider_verification_requests WHERE provider_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_provider_verification_requests_provider_id ON public.provider_verification_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_verification_requests_status ON public.provider_verification_requests(verification_status);
CREATE INDEX IF NOT EXISTS idx_provider_verification_requests_nmr_id ON public.provider_verification_requests(nmr_id);
CREATE INDEX IF NOT EXISTS idx_verification_documents_request_id ON public.verification_documents(verification_request_id);

-- Add trigger for updated_at
CREATE TRIGGER update_provider_verification_requests_updated_at 
  BEFORE UPDATE ON public.provider_verification_requests 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();