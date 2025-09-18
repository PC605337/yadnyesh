-- Add storage buckets for file uploads (essential feature)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('health-records', 'health-records', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

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