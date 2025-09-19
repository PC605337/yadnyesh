-- Just assign admin role to current user
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
    id,
    'admin'::app_role,
    now()
FROM auth.users 
WHERE email = (
    SELECT email 
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1
)
ON CONFLICT (user_id, role) DO NOTHING;

-- Also assign provider role
INSERT INTO public.user_roles (user_id, role, assigned_at)
SELECT 
    id,
    'provider'::app_role,
    now()
FROM auth.users 
WHERE email = (
    SELECT email 
    FROM auth.users 
    ORDER BY created_at 
    LIMIT 1
)
ON CONFLICT (user_id, role) DO NOTHING;