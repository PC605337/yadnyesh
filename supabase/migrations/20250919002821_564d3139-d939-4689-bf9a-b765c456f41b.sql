-- First assign admin role to current user and create basic demo data

-- Assign admin role to the current user (first user)
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

-- Create some demo provider users first (simpler approach)
DO $$
DECLARE
    provider1_id uuid := '11111111-1111-1111-1111-111111111111';
    provider2_id uuid := '22222222-2222-2222-2222-222222222222';
    provider3_id uuid := '33333333-3333-3333-3333-333333333333';
    current_user_id uuid;
BEGIN
    -- Get current user ID
    SELECT id INTO current_user_id FROM auth.users ORDER BY created_at LIMIT 1;
    
    -- Create demo profiles for existing user as providers (simulate multiple doctors)
    INSERT INTO public.profiles (user_id, email, first_name, last_name, role, created_at, updated_at)
    VALUES 
        (current_user_id, (SELECT email FROM auth.users WHERE id = current_user_id), 'Priya', 'Sharma', 'provider', now(), now())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        role = EXCLUDED.role;
    
    -- Create provider profile for current user
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
            'Experienced general medicine practitioner with 12 years of practice.',
            12,
            ARRAY['General Medicine', 'Internal Medicine'],
            500,
            4.8,
            '{"degrees": ["MBBS", "MD"], "certifications": ["Board Certified Internal Medicine"]}',
            true,
            324
        )
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create some demo appointments for the current user
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
        (current_user_id, current_user_id, now() + interval '2 days', 'video', 'scheduled', 30, 500, 'General health checkup', now() - interval '1 day'),
        (current_user_id, current_user_id, now() + interval '5 days', 'in-person', 'scheduled', 45, 800, 'Follow-up consultation', now() - interval '2 days'),
        (current_user_id, current_user_id, now() - interval '1 week', 'video', 'completed', 60, 600, 'Health assessment', now() - interval '1 week')
    ON CONFLICT DO NOTHING;
    
    -- Create payment transactions for completed appointments
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
    ) 
    SELECT 
        a.patient_id,
        a.provider_id,
        a.fee_amount,
        'completed',
        'upi',
        'razorpay',
        'txn_' || substr(md5(random()::text), 1, 12),
        'consultation_fee',
        a.appointment_date,
        a.created_at
    FROM appointments a
    WHERE a.status = 'completed' AND a.patient_id = current_user_id;
    
    -- Create some prescriptions
    INSERT INTO public.prescriptions (
        patient_id,
        provider_id,
        medications,
        diagnosis,
        instructions,
        status,
        issued_date,
        expiry_date
    ) 
    SELECT 
        a.patient_id,
        a.provider_id,
        '[{"name": "Paracetamol", "dosage": "500mg", "frequency": "Twice daily", "duration": "5 days"}]'::jsonb,
        'Viral fever',
        'Take medication as prescribed. Follow up if symptoms persist.',
        'active',
        a.appointment_date,
        a.appointment_date + interval '30 days'
    FROM appointments a
    WHERE a.status = 'completed' AND a.patient_id = current_user_id;
    
    -- Assign provider role to current user as well
    INSERT INTO public.user_roles (user_id, role, assigned_at)
    VALUES (current_user_id, 'provider'::app_role, now())
    ON CONFLICT (user_id, role) DO NOTHING;
    
END $$;