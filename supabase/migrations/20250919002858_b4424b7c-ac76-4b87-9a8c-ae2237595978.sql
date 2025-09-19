-- Simple migration to give current user admin access and create basic demo data

-- Assign admin role to the current user
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

-- Also assign provider role so you can test provider features
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

-- Create a simple provider profile for current user
DO $$
DECLARE
    current_user_id uuid;
BEGIN
    SELECT id INTO current_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    -- Create provider profile
    INSERT INTO public.provider_profiles (
        user_id, 
        bio, 
        experience_years, 
        specialties, 
        consultation_fee,
        rating,
        certifications,
        is_verified,
        total_consultations
    ) VALUES 
        (
            current_user_id,
            'Healthcare provider with extensive experience in patient care.',
            10,
            ARRAY['General Medicine'],
            500,
            4.5,
            '{}'::jsonb,
            true,
            100
        )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create a simple appointment (using 'video' which should be valid)
    INSERT INTO public.appointments (
        patient_id,
        provider_id,
        appointment_date,
        type,
        status,
        duration_minutes,
        fee_amount,
        reason,
        created_at
    ) VALUES 
        (current_user_id, current_user_id, now() + interval '2 days', 'video', 'scheduled', 30, 500, 'Health consultation', now())
    ON CONFLICT DO NOTHING;
    
    -- Create a completed appointment for analytics
    INSERT INTO public.appointments (
        patient_id,
        provider_id,
        appointment_date,
        type,
        status,
        duration_minutes,
        fee_amount,
        reason,
        created_at
    ) VALUES 
        (current_user_id, current_user_id, now() - interval '1 week', 'video', 'completed', 30, 500, 'Health checkup', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
    
    -- Create a payment transaction for the completed appointment
    INSERT INTO public.payment_transactions (
        patient_id,
        provider_id,
        amount,
        status,
        payment_method,
        payment_gateway,
        transaction_id,
        transaction_type,
        completed_at,
        created_at
    ) VALUES 
        (current_user_id, current_user_id, 500, 'completed', 'upi', 'razorpay', 'demo_txn_001', 'consultation_fee', now() - interval '1 week', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
    
END $$;