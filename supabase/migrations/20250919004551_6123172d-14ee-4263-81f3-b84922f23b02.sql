-- Add patient and corporate roles for testing the role switcher
INSERT INTO user_roles (user_id, role, is_active) 
VALUES 
  ('444dac66-0c0f-4305-b079-6f3550e8544b', 'patient'::app_role, true),
  ('444dac66-0c0f-4305-b079-6f3550e8544b', 'corporate'::app_role, true)
ON CONFLICT (user_id, role) DO UPDATE SET 
  is_active = true;