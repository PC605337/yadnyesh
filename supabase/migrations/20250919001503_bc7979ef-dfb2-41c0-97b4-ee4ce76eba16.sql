-- Fix search_path for existing functions that might not have it set properly
-- This addresses the "Function Search Path Mutable" security warning

-- Update handle_new_user function to ensure proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient')
  );
  
  -- Also assign default patient role in user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'patient'::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Update update_updated_at_column function to ensure proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Create a function to safely get user role (helps prevent RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT role::text 
         FROM public.user_roles 
         WHERE user_id = _user_id 
         AND is_active = true 
         ORDER BY 
           CASE role 
             WHEN 'admin' THEN 1
             WHEN 'corporate' THEN 2
             WHEN 'provider' THEN 3
             ELSE 4
           END 
         LIMIT 1),
        'patient'
    );
$$;

-- Create a function to check if current user is admin (more efficient)
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.get_user_role() = 'admin';
$$;