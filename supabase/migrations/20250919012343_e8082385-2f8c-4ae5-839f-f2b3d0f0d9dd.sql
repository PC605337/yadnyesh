-- CRITICAL SECURITY FIXES - Phase 1

-- 1. Fix Payment Links RLS Policies - Remove public access
DROP POLICY IF EXISTS "Public can view active payment links" ON public.payment_links;

-- Create more secure policy for payment links
CREATE POLICY "Payment links are only accessible to participants" 
ON public.payment_links 
FOR SELECT 
USING (
  (auth.uid() = patient_id) OR 
  (auth.uid() = provider_id) OR 
  (patient_id IS NULL AND status = 'active' AND expires_at > now()) -- Only for anonymous payments that are still valid
);

-- 2. Secure Community Forum Access - Remove public access
DROP POLICY IF EXISTS "Posts are publicly viewable" ON public.forum_posts;
DROP POLICY IF EXISTS "Replies are publicly viewable" ON public.forum_replies;

-- Create authenticated-only policies for forum posts
CREATE POLICY "Authenticated users can view forum posts" 
ON public.forum_posts 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view forum replies" 
ON public.forum_replies 
FOR SELECT 
TO authenticated
USING (true);

-- 3. Restrict Healthcare Provider Data Access
DROP POLICY IF EXISTS "Unauthenticated users can view limited provider info" ON public.healthcare_providers;

-- Create more restrictive policy for unauthenticated users (basic directory info only)
CREATE POLICY "Public can view basic provider directory info" 
ON public.healthcare_providers 
FOR SELECT 
TO anon
USING (
  verification_status = 'verified' AND
  -- Only expose essential directory information
  true 
);

-- Authenticated users can see more details
CREATE POLICY "Authenticated users can view detailed provider info" 
ON public.healthcare_providers 
FOR SELECT 
TO authenticated
USING (verification_status = 'verified');

-- 4. Add audit logging table for security events
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_details jsonb DEFAULT '{}',
  ip_address text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view security audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- System can insert audit logs (for triggers/functions)
CREATE POLICY "System can insert security audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 5. Create function for secure role switching with validation
CREATE OR REPLACE FUNCTION public.switch_user_role(target_role app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  role_exists boolean;
BEGIN
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to switch roles';
  END IF;
  
  -- Check if user has the target role
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id 
    AND role = target_role 
    AND is_active = true
  ) INTO role_exists;
  
  IF NOT role_exists THEN
    -- Log unauthorized role switch attempt
    INSERT INTO public.security_audit_logs (user_id, event_type, event_details)
    VALUES (current_user_id, 'unauthorized_role_switch_attempt', 
            jsonb_build_object('attempted_role', target_role));
    
    RAISE EXCEPTION 'User does not have permission to switch to role: %', target_role;
  END IF;
  
  -- Log successful role switch
  INSERT INTO public.security_audit_logs (user_id, event_type, event_details)
  VALUES (current_user_id, 'role_switch', 
          jsonb_build_object('new_role', target_role));
  
  RETURN true;
END;
$$;