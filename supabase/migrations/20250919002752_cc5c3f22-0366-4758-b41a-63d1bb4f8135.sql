-- Fix database relationships and add demo data

-- First, let's make sure the foreign keys exist
-- Add foreign key constraint from provider_profiles to profiles if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'provider_profiles_user_id_fkey' 
        AND table_name = 'provider_profiles'
    ) THEN
        ALTER TABLE provider_profiles 
        ADD CONSTRAINT provider_profiles_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint from appointments to provider_profiles if not exists  
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'appointments_provider_id_fkey' 
        AND table_name = 'appointments'
    ) THEN
        ALTER TABLE appointments 
        ADD CONSTRAINT appointments_provider_id_fkey 
        FOREIGN KEY (provider_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

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

-- Create some demo provider users and profiles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'dr.sharma@healthcare.com', '$2a$10$dummy', now(), now(), now(), '{"first_name": "Priya", "last_name": "Sharma", "role": "provider"}'),
    ('22222222-2222-2222-2222-222222222222', 'dr.kumar@healthcare.com', '$2a$10$dummy', now(), now(), now(), '{"first_name": "Rajesh", "last_name": "Kumar", "role": "provider"}'),
    ('33333333-3333-3333-3333-333333333333', 'dr.mehta@healthcare.com', '$2a$10$dummy', now(), now(), now(), '{"first_name": "Anita", "last_name": "Mehta", "role": "provider"}')
ON CONFLICT (id) DO NOTHING;

-- Create profiles for demo providers
INSERT INTO public.profiles (user_id, email, first_name, last_name, role, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'dr.sharma@healthcare.com', 'Priya', 'Sharma', 'provider', now(), now()),
    ('22222222-2222-2222-2222-222222222222', 'dr.kumar@healthcare.com', 'Rajesh', 'Kumar', 'provider', now(), now()),
    ('33333333-3333-3333-3333-333333333333', 'dr.mehta@healthcare.com', 'Anita', 'Mehta', 'provider', now(), now())
ON CONFLICT (user_id) DO NOTHING;

-- Create provider profiles for demo doctors
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
        '11111111-1111-1111-1111-111111111111',
        'Experienced general medicine practitioner with 12 years of practice.',
        12,
        ARRAY['General Medicine', 'Internal Medicine'],
        500,
        4.8,
        '{"degrees": ["MBBS", "MD"], "certifications": ["Board Certified Internal Medicine"]}',
        true,
        324
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        'Cardiologist specializing in heart diseases and preventive cardiology.',
        15,
        ARRAY['Cardiology', 'Interventional Cardiology'],
        800,
        4.9,
        '{"degrees": ["MBBS", "MD", "DM Cardiology"], "certifications": ["Fellow of Cardiology"]}',
        true,
        156
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        'Mental health specialist focusing on anxiety and depression treatment.',
        8,
        ARRAY['Psychiatry', 'Mental Health'],
        600,
        4.7,
        '{"degrees": ["MBBS", "MD Psychiatry"], "certifications": ["Licensed Psychiatrist"]}',
        true,
        89
    )
ON CONFLICT (user_id) DO NOTHING;

-- Create healthcare providers data
INSERT INTO public.healthcare_providers (
    name,
    provider_type,
    address,
    contact_info,
    city,
    state,
    country,
    services,
    insurance_accepted,
    pricing_info,
    location_coords,
    is_partner,
    verification_status
) VALUES 
    (
        'Dr. Priya Sharma Clinic',
        'Individual Practice',
        '{"street": "123 Medical Center", "area": "Bandra West", "pincode": "400050"}',
        '{"phone": "+91-98765-43210", "email": "clinic@drsharma.com"}',
        'Mumbai',
        'Maharashtra',
        'India',
        '["General Consultation", "Health Checkups", "Preventive Care"]',
        '["Star Health", "HDFC ERGO", "ICICI Lombard"]',
        '{"consultation": 500, "followup": 300}',
        '(19.0596, 72.8295)',
        true,
        'verified'
    ),
    (
        'Kumar Heart Care Center',
        'Specialty Clinic',
        '{"street": "456 Heart Street", "area": "Connaught Place", "pincode": "110001"}',
        '{"phone": "+91-98765-43211", "email": "info@kumarheartcare.com"}',
        'Delhi',
        'Delhi',
        'India',
        '["Cardiology", "ECG", "Stress Testing", "Cardiac Surgery"]',
        '["Bajaj Allianz", "New India Assurance", "Oriental Insurance"]',
        '{"consultation": 800, "procedures": 5000}',
        '(28.6139, 77.2090)',
        true,
        'verified'
    ),
    (
        'Mehta Mental Wellness Center',
        'Mental Health Clinic',
        '{"street": "789 Wellness Ave", "area": "Koramangala", "pincode": "560095"}',
        '{"phone": "+91-98765-43212", "email": "care@mentawellness.com"}',
        'Bangalore',
        'Karnataka',
        'India',
        '["Psychiatry", "Counseling", "Therapy Sessions", "Mental Health Assessments"]',
        '["Max Bupa", "Care Health", "Religare"]',
        '{"consultation": 600, "therapy": 1200}',
        '(12.9352, 77.6245)',
        true,
        'verified'
    )
ON CONFLICT DO NOTHING;

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
) 
SELECT 
    (SELECT id FROM auth.users ORDER BY created_at LIMIT 1), -- Current user as patient
    provider_id,
    appointment_date,
    type,
    status,
    duration_minutes,
    fee_amount,
    reason,
    created_at
FROM (VALUES 
    ('11111111-1111-1111-1111-111111111111', now() + interval '2 days', 'video', 'scheduled', 30, 500, 'General health checkup', now() - interval '1 day'),
    ('22222222-2222-2222-2222-222222222222', now() + interval '5 days', 'in-person', 'scheduled', 45, 800, 'Cardiac consultation', now() - interval '2 days'),
    ('33333333-3333-3333-3333-333333333333', now() - interval '1 week', 'video', 'completed', 60, 600, 'Mental health session', now() - interval '1 week')
) AS demo_appointments(provider_id, appointment_date, type, status, duration_minutes, fee_amount, reason, created_at);

-- Create some payment transactions for revenue tracking
INSERT INTO public.payment_transactions (
    patient_id,
    provider_id,
    appointment_id,
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
    a.id,
    a.fee_amount,
    'completed',
    CASE 
        WHEN random() < 0.4 THEN 'upi'
        WHEN random() < 0.7 THEN 'card'
        ELSE 'net_banking'
    END,
    'razorpay',
    'txn_' || substr(md5(random()::text), 1, 12),
    'consultation_fee',
    a.appointment_date,
    a.created_at
FROM appointments a
WHERE a.status = 'completed';

-- Create some prescriptions
INSERT INTO public.prescriptions (
    patient_id,
    provider_id,
    appointment_id,
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
    a.id,
    CASE a.provider_id
        WHEN '11111111-1111-1111-1111-111111111111' THEN 
            '[{"name": "Paracetamol", "dosage": "500mg", "frequency": "Twice daily", "duration": "5 days"}]'::jsonb
        WHEN '22222222-2222-2222-2222-222222222222' THEN 
            '[{"name": "Aspirin", "dosage": "75mg", "frequency": "Once daily", "duration": "30 days"}]'::jsonb
        ELSE 
            '[{"name": "Multivitamin", "dosage": "1 tablet", "frequency": "Once daily", "duration": "30 days"}]'::jsonb
    END,
    CASE a.provider_id
        WHEN '11111111-1111-1111-1111-111111111111' THEN 'Viral fever'
        WHEN '22222222-2222-2222-2222-222222222222' THEN 'Hypertension management'
        ELSE 'Vitamin deficiency'
    END,
    'Take medication as prescribed. Follow up if symptoms persist.',
    'active',
    a.appointment_date,
    a.appointment_date + interval '30 days'
FROM appointments a
WHERE a.status = 'completed';

-- Assign provider roles to demo users
INSERT INTO public.user_roles (user_id, role, assigned_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'provider'::app_role, now()),
    ('22222222-2222-2222-2222-222222222222', 'provider'::app_role, now()),
    ('33333333-3333-3333-3333-333333333333', 'provider'::app_role, now())
ON CONFLICT (user_id, role) DO NOTHING;