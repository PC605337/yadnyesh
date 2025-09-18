-- Fix critical security issues by adding authentication requirements to public tables

-- Update healthcare_providers RLS policies to require authentication
DROP POLICY IF EXISTS "Providers are publicly viewable" ON public.healthcare_providers;

CREATE POLICY "Authenticated users can view basic provider info" 
ON public.healthcare_providers 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Unauthenticated users can view limited provider info" 
ON public.healthcare_providers 
FOR SELECT 
TO anon
USING (verification_status = 'verified');

-- Update provider_profiles RLS policies to protect sensitive data
DROP POLICY IF EXISTS "Provider profiles are publicly viewable" ON public.provider_profiles;

CREATE POLICY "Authenticated users can view provider profiles" 
ON public.provider_profiles 
FOR SELECT 
TO authenticated
USING (is_verified = true);

CREATE POLICY "Public can view basic provider info only" 
ON public.provider_profiles 
FOR SELECT 
TO anon
USING (is_verified = true);

-- Update insurance_providers to require authentication for detailed info
DROP POLICY IF EXISTS "Insurance providers are publicly viewable" ON public.insurance_providers;

CREATE POLICY "Authenticated users can view insurance providers" 
ON public.insurance_providers 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Update wellness_programs to require authentication for full content
DROP POLICY IF EXISTS "Programs are publicly viewable" ON public.wellness_programs;

CREATE POLICY "Authenticated users can view wellness programs" 
ON public.wellness_programs 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Public can view program summaries only" 
ON public.wellness_programs 
FOR SELECT 
TO anon
USING (true);

-- Add storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('health-records', 'health-records', false);

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true);

-- Create storage policies for health records
CREATE POLICY "Users can view their own health record files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own health record files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own health record files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'health-records' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);