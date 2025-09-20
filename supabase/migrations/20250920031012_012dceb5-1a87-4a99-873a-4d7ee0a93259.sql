-- Fix Security Linter Warnings - Function Search Path

-- Fix all functions to have proper search_path settings for security

-- 1. Fix log_security_event function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Fix check_suspicious_activity function
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
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. Fix check_rate_limit function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Fix log_auth_attempt function
CREATE OR REPLACE FUNCTION log_auth_attempt(
  attempt_type TEXT,
  success BOOLEAN,
  user_email TEXT DEFAULT NULL,
  additional_details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO security_audit_logs (user_id, event_type, event_details, ip_address)
  VALUES (
    auth.uid(),
    CASE 
      WHEN success THEN attempt_type || '_success'
      ELSE attempt_type || '_failure'
    END,
    jsonb_build_object(
      'email', user_email,
      'success', success,
      'timestamp', NOW()
    ) || additional_details,
    current_setting('request.headers', true)::JSONB->>'x-forwarded-for'
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Auth logging failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Fix validate_sensitive_operation function
CREATE OR REPLACE FUNCTION validate_sensitive_operation(
  operation_type TEXT,
  required_role TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  user_has_role BOOLEAN := false;
  rate_limit_ok BOOLEAN := false;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    PERFORM log_security_event('unauthorized_access_attempt', 
      jsonb_build_object('operation', operation_type));
    RETURN false;
  END IF;
  
  -- Check role if required
  IF required_role IS NOT NULL THEN
    SELECT has_role(auth.uid(), required_role::app_role) INTO user_has_role;
    IF NOT user_has_role THEN
      PERFORM log_security_event('insufficient_permissions', 
        jsonb_build_object('operation', operation_type, 'required_role', required_role));
      RETURN false;
    END IF;
  END IF;
  
  -- Check rate limiting
  SELECT check_rate_limit(operation_type) INTO rate_limit_ok;
  IF NOT rate_limit_ok THEN
    PERFORM log_security_event('rate_limit_exceeded', 
      jsonb_build_object('operation', operation_type));
    RETURN false;
  END IF;
  
  -- Log successful validation
  PERFORM log_security_event('operation_validated', 
    jsonb_build_object('operation', operation_type));
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;