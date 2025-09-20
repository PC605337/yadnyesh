-- Fix Security Linter Warnings: Function Search Path Issues

-- 1. Fix check_suspicious_activity function - add SET search_path
CREATE OR REPLACE FUNCTION check_suspicious_activity()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 2. Fix check_rate_limit function - add SET search_path
CREATE OR REPLACE FUNCTION check_rate_limit(
  operation_type TEXT,
  max_attempts INTEGER DEFAULT 10,
  time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 3. Fix log_security_event function - add SET search_path  
CREATE OR REPLACE FUNCTION log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;