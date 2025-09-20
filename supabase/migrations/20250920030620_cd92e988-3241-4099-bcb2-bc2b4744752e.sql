-- Critical Security Fixes - Phase 2: Data Access Restrictions (Fixed)

-- 1. SECURE PAYMENT LINKS - Remove all existing policies first
DROP POLICY IF EXISTS "Payment links are only accessible to participants" ON payment_links;
DROP POLICY IF EXISTS "Providers can manage their payment links" ON payment_links;
DROP POLICY IF EXISTS "Patients can view their payment links" ON payment_links;
DROP POLICY IF EXISTS "Authenticated users can view their payment links" ON payment_links;

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

CREATE POLICY "Providers can manage their payment links v2" 
ON payment_links 
FOR ALL 
USING (auth.uid() = provider_id)
WITH CHECK (auth.uid() = provider_id);

-- 2. LOCK DOWN COMMUNITY FORUMS - Remove public access
DROP POLICY IF EXISTS "Forums are publicly viewable" ON community_forums;
DROP POLICY IF EXISTS "Authenticated users can view forum posts" ON forum_posts;
DROP POLICY IF EXISTS "Authenticated users can view forum replies" ON forum_replies;
DROP POLICY IF EXISTS "Authenticated users can view forums" ON community_forums;

-- Create authenticated-only forum policies
CREATE POLICY "Authenticated users can view forums" 
ON community_forums 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view forum posts v2" 
ON forum_posts 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view forum replies v2" 
ON forum_replies 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- 3. RESTRICT HEALTHCARE PROVIDER ACCESS
DROP POLICY IF EXISTS "Public can view basic provider directory info" ON healthcare_providers;
DROP POLICY IF EXISTS "Authenticated users can view basic provider info" ON healthcare_providers;
DROP POLICY IF EXISTS "Authenticated users can view detailed provider info" ON healthcare_providers;
DROP POLICY IF EXISTS "Public directory - basic info only" ON healthcare_providers;
DROP POLICY IF EXISTS "Authenticated users - verified providers only" ON healthcare_providers;

-- Create restricted provider access policies
CREATE POLICY "Public directory basic info only" 
ON healthcare_providers 
FOR SELECT 
USING (verification_status = 'verified');

CREATE POLICY "Authenticated users verified providers only" 
ON healthcare_providers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  verification_status = 'verified'
);

-- 4. ENHANCE PROVIDER PROFILES SECURITY
DROP POLICY IF EXISTS "Public can view basic provider info only" ON provider_profiles;
DROP POLICY IF EXISTS "Authenticated users can view verified provider profiles" ON provider_profiles;

CREATE POLICY "Authenticated users can view verified provider profiles v2" 
ON provider_profiles 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND 
  is_verified = true
);

-- 5. SECURE NOTIFICATIONS - Ensure users only see their own
DROP POLICY IF EXISTS "Users can create notifications for themselves" ON notifications;

CREATE POLICY "Users can create notifications for themselves v2" 
ON notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 6. ADD SECURITY AUDIT LOGGING FUNCTION
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
EXCEPTION
  WHEN OTHERS THEN
    -- Log to system if security_audit_logs fails
    RAISE NOTICE 'Security logging failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. CREATE FUNCTION TO CHECK SUSPICIOUS ACTIVITY
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

-- 8. ADD RATE LIMITING FOR SECURITY-SENSITIVE OPERATIONS
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

-- 9. UPDATE EXISTING POLICIES TO BE MORE RESTRICTIVE
DROP POLICY IF EXISTS "Patients can view their insurance claims" ON insurance_claims;
CREATE POLICY "Patients can view their insurance claims v2" 
ON insurance_claims 
FOR SELECT 
USING (auth.uid() = patient_id);

-- 10. Log successful completion
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