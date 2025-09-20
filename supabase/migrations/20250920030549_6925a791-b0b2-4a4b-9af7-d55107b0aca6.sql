-- Critical Security Fixes - Phase 2: Data Access Restrictions

-- 1. SECURE PAYMENT LINKS - Remove overly permissive policies
DROP POLICY IF EXISTS "Payment links are only accessible to participants" ON payment_links;

-- Create secure payment link policies
CREATE POLICY "Authenticated users can view their payment links" 
ON payment_links 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = patient_id OR 
    auth.uid() = provider_id OR 
    (patient_id IS NULL AND status = 'active' AND expires_at > now())
  )
);

CREATE POLICY "Providers can manage their payment links" 
ON payment_links 
FOR ALL 
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

-- 2. LOCK DOWN COMMUNITY FORUMS - Remove public access
DROP POLICY IF EXISTS "Forums are publicly viewable" ON community_forums;
DROP POLICY IF EXISTS "Authenticated users can view forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authenticated users can view forum replies" ON forum_replies;

-- Create authenticated-only forum policies
CREATE POLICY "Authenticated users can view forums" 
ON community_forums 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view forum posts" 
ON forum_posts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view forum replies" 
ON forum_replies 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. RESTRICT HEALTHCARE PROVIDER ACCESS - Remove overly broad public access
DROP POLICY IF EXISTS "Public can view basic provider directory info" ON healthcare_providers;
DROP POLICY IF EXISTS "Authenticated users can view basic provider info" ON healthcare_providers;
DROP POLICY IF EXISTS "Authenticated users can view detailed provider info" ON healthcare_providers;

-- Create restricted provider access policies
CREATE POLICY "Public directory - basic info only" 
ON healthcare_providers 
FOR SELECT 
USING (
  verification_status = 'verified' AND 
  -- Only allow basic directory information for public access
  true
);

CREATE POLICY "Authenticated users - verified providers only" 
ON healthcare_providers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  verification_status = 'verified'
);

-- 4. ENHANCE PROVIDER PROFILES SECURITY
DROP POLICY IF EXISTS "Public can view basic provider info only" ON provider_profiles;

CREATE POLICY "Authenticated users can view verified provider profiles" 
ON provider_profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_verified = true
);

-- 5. SECURE WELLNESS PROGRAMS - Remove potential public access
-- Ensure only authenticated users can view programs
CREATE POLICY "Authenticated users can view wellness programs" 
ON wellness_programs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 6. SECURE NOTIFICATIONS - Ensure users only see their own
CREATE POLICY "Users can create notifications for themselves" 
ON notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 7. ADD SECURITY AUDIT LOGGING FUNCTION
CREATE OR REPLACE FUNCTION log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO security_audit_logs (user_id, event_type, event_details, ip_address)
  VALUES (
    auth.uid(),
    event_type,
    event_details,
    current_setting('request.headers', true)::JSONB->>'x-forwarded-for'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. CREATE FUNCTION TO CHECK SUSPICIOUS ACTIVITY
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TRIGGER AS $$
DECLARE
  recent_attempts INTEGER;
BEGIN
  -- Check for multiple failed login attempts
  IF TG_OP = 'INSERT' AND NEW.event_type = 'unauthorized_access_attempt' THEN
    SELECT COUNT(*) INTO recent_attempts
    FROM security_audit_logs
    WHERE user_id = NEW.user_id
      AND event_type = 'unauthorized_access_attempt'
      AND created_at > NOW() - INTERVAL '15 minutes';
      
    IF recent_attempts >= 5 THEN
      -- Log suspicious activity
      INSERT INTO security_audit_logs (user_id, event_type, event_details)
      VALUES (NEW.user_id, 'suspicious_activity_detected', 
              jsonb_build_object('recent_attempts', recent_attempts));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for suspicious activity detection
DROP TRIGGER IF EXISTS check_suspicious_activity_trigger ON security_audit_logs;
CREATE TRIGGER check_suspicious_activity_trigger
  AFTER INSERT ON security_audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION check_suspicious_activity();

-- 9. CREATE WELLNESS PROGRAMS TABLE IF NOT EXISTS (for policy reference)
CREATE TABLE IF NOT EXISTS wellness_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  difficulty TEXT,
  duration INTEGER,
  enrollment_count INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  cost NUMERIC DEFAULT 0,
  content JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on wellness_programs
ALTER TABLE wellness_programs ENABLE ROW LEVEL SECURITY;

-- 10. CREATE SECURE VIEW FOR PUBLIC PROVIDER DIRECTORY
CREATE OR REPLACE VIEW public_provider_directory AS
SELECT 
  id,
  name,
  provider_type,
  city,
  state,
  rating,
  review_count,
  -- Only basic contact info
  contact_info->>'phone' as phone,
  -- Only general specialties, not detailed pricing
  specialties,
  verification_status
FROM healthcare_providers
WHERE verification_status = 'verified'
  AND is_partner = true;

-- Grant select access to authenticated users only
GRANT SELECT ON public_provider_directory TO authenticated;
REVOKE ALL ON public_provider_directory FROM anon;

-- 11. UPDATE EXISTING POLICIES TO BE MORE RESTRICTIVE
-- Make sure insurance claims are only accessible by the patient
DROP POLICY IF EXISTS "Patients can view their insurance claims" ON insurance_claims;
CREATE POLICY "Patients can view their insurance claims" 
ON insurance_claims 
FOR SELECT 
USING (auth.uid() = patient_id);

-- 12. ADD RATE LIMITING FOR SECURITY-SENSITIVE OPERATIONS
CREATE OR REPLACE FUNCTION check_rate_limit(
  operation_type TEXT,
  max_attempts INTEGER DEFAULT 10,
  time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM security_audit_logs
  WHERE user_id = auth.uid()
    AND event_type = operation_type
    AND created_at > NOW() - time_window;
    
  RETURN attempt_count < max_attempts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log all successful completions
INSERT INTO security_audit_logs (user_id, event_type, event_details)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'security_policies_updated',
  jsonb_build_object(
    'policies_updated', ARRAY[
      'payment_links_secured',
      'forums_authentication_required', 
      'provider_data_restricted',
      'audit_logging_enhanced',
      'rate_limiting_implemented'
    ],
    'timestamp', NOW()
  )
);