import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    console.log('Starting demo data population for Mumbai...');

    // Create demo profiles (patients and providers)
    const demoProfiles = [
      // Patients
      {
        id: 'patient-1',
        user_id: 'patient-1',
        email: 'priya.sharma@email.com',
        first_name: 'Priya',
        last_name: 'Sharma',
        role: 'patient',
        phone: '+91-9876543210',
        gender: 'female',
        date_of_birth: '1992-05-15',
        address: {
          street: '204, Shivaji Nagar',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400017'
        }
      },
      {
        id: 'patient-2', 
        user_id: 'patient-2',
        email: 'rajesh.patel@email.com',
        first_name: 'Rajesh',
        last_name: 'Patel',
        role: 'patient',
        phone: '+91-9876543211',
        gender: 'male',
        date_of_birth: '1985-08-22',
        address: {
          street: '15, Linking Road, Bandra',
          city: 'Mumbai',
          state: 'Maharashtra', 
          pincode: '400050'
        }
      },
      // Providers
      {
        id: 'provider-1',
        user_id: 'provider-1',
        email: 'dr.mehta@email.com',
        first_name: 'Dr. Anjali',
        last_name: 'Mehta',
        role: 'provider',
        phone: '+91-9876543220',
        gender: 'female'
      },
      {
        id: 'provider-2',
        user_id: 'provider-2', 
        email: 'dr.singh@email.com',
        first_name: 'Dr. Vikram',
        last_name: 'Singh',
        role: 'provider',
        phone: '+91-9876543221',
        gender: 'male'
      }
    ];

    // Insert demo profiles
    const { error: profilesError } = await supabaseService
      .from('profiles')
      .upsert(demoProfiles);

    if (profilesError) throw profilesError;

    // Create provider profiles
    const providerProfiles = [
      {
        user_id: 'provider-1',
        specialties: ['Obstetrics', 'Gynecology'],
        license_number: 'MH12345',
        experience_years: 12,
        consultation_fee: 800,
        bio: 'Specialist in maternal health and women\'s care',
        education: [{
          degree: 'MBBS, MS (OBG)',
          institution: 'King Edward Memorial Hospital, Mumbai',
          year: 2010
        }],
        is_verified: true,
        rating: 4.8,
        total_consultations: 1250
      },
      {
        user_id: 'provider-2',
        specialties: ['Pediatrics', 'Child Development'],
        license_number: 'MH12346',
        experience_years: 8,
        consultation_fee: 600,
        bio: 'Pediatric specialist focusing on child growth and development',
        education: [{
          degree: 'MBBS, MD (Pediatrics)',
          institution: 'Lokmanya Tilak Municipal Medical College, Mumbai',
          year: 2015
        }],
        is_verified: true,
        rating: 4.6,
        total_consultations: 890
      }
    ];

    const { error: providerError } = await supabaseService
      .from('provider_profiles')
      .upsert(providerProfiles);

    if (providerError) throw providerError;

    // Create demo appointments
    const appointments = [
      {
        patient_id: 'patient-1',
        provider_id: 'provider-1',
        appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        type: 'video_call',
        reason: 'Prenatal checkup',
        status: 'confirmed',
        duration_minutes: 30,
        fee_amount: 800
      },
      {
        patient_id: 'patient-2',
        provider_id: 'provider-2', 
        appointment_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        type: 'in_person',
        reason: 'Child vaccination',
        status: 'scheduled',
        duration_minutes: 30,
        fee_amount: 600
      }
    ];

    const { error: appointmentsError } = await supabaseService
      .from('appointments')
      .upsert(appointments);

    if (appointmentsError) throw appointmentsError;

    // Create maternal health records
    const maternalRecords = [
      {
        patient_id: 'patient-1',
        pregnancy_stage: 'second_trimester',
        gestational_week: 24,
        expected_due_date: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        weight_tracking: [
          { date: '2025-01-01', weight: 58.5 },
          { date: '2025-02-01', weight: 60.2 },
          { date: '2025-03-01', weight: 62.8 }
        ],
        vital_signs: {
          blood_pressure: '110/70',
          heart_rate: 78,
          temperature: 98.6
        }
      }
    ];

    const { error: maternalError } = await supabaseService
      .from('maternal_records')
      .upsert(maternalRecords);

    if (maternalError) throw maternalError;

    // Create pediatric records
    const pediatricRecords = [
      {
        patient_id: 'child-1',
        parent_id: 'patient-2',
        birth_date: new Date('2023-06-15').toISOString().split('T')[0],
        birth_weight: 3.2,
        birth_height: 50,
        vaccination_schedule: [
          {
            vaccine: 'BCG',
            date: '2023-06-16',
            status: 'completed'
          },
          {
            vaccine: 'DPT-1',
            date: '2023-08-15',
            status: 'completed'
          },
          {
            vaccine: 'DPT-2',
            due_date: '2025-04-15',
            status: 'scheduled'
          }
        ],
        growth_milestones: [
          {
            milestone: 'First smile',
            expected_age_months: 2,
            actual_age_months: 2,
            status: 'achieved'
          }
        ]
      }
    ];

    const { error: pediatricError } = await supabaseService
      .from('pediatric_records')
      .upsert(pediatricRecords);

    if (pediatricError) throw pediatricError;

    // Create wellness programs
    const wellnessPrograms = [
      {
        name: 'Maternal Wellness Program',
        description: 'Comprehensive prenatal and postnatal care program',
        program_type: 'maternal',
        duration_weeks: 40,
        difficulty_level: 'beginner',
        rating: 4.8,
        enrollment_count: 156,
        cost: 2500,
        content: {
          modules: ['Nutrition during pregnancy', 'Exercise guidelines', 'Mental health support'],
          resources: ['Video sessions', 'Meal plans', 'Progress tracking']
        }
      },
      {
        name: 'Diabetes Management Program',
        description: 'Comprehensive diabetes care and lifestyle management',
        program_type: 'chronic_disease',
        duration_weeks: 12,
        difficulty_level: 'intermediate',
        rating: 4.6,
        enrollment_count: 243,
        cost: 1500,
        content: {
          modules: ['Diet planning', 'Glucose monitoring', 'Exercise routines'],
          resources: ['Mobile app', 'Glucose tracker', 'Dietitian consultations']
        }
      }
    ];

    const { error: programsError } = await supabaseService
      .from('wellness_programs')
      .upsert(wellnessPrograms);

    if (programsError) throw programsError;

    // Create community forums
    const forums = [
      {
        name: 'Maternal Health Support',
        description: 'Support group for expectant and new mothers',
        category: 'maternal_health',
        post_count: 45,
        member_count: 128,
        moderator_id: 'provider-1'
      },
      {
        name: 'Pediatric Care Discussion',
        description: 'Parents sharing experiences about child care',
        category: 'pediatrics',
        post_count: 67,
        member_count: 203,
        moderator_id: 'provider-2'
      }
    ];

    const { error: forumsError } = await supabaseService
      .from('community_forums')
      .upsert(forums);

    if (forumsError) throw forumsError;

    // Create sample cost predictions
    const costPredictions = [
      {
        patient_id: 'patient-1',
        condition_or_service: 'Normal Delivery',
        prediction_type: 'maternal_care',
        predicted_cost: 125000,
        out_of_pocket_cost: 45000,
        insurance_coverage: 80000,
        confidence_level: 0.85,
        timeline_months: 6,
        cost_breakdown: {
          consultations: 25000,
          diagnostics: 15000,
          hospitalization: 60000,
          medications: 25000
        },
        recommendations: [
          'Consider upgrading insurance coverage',
          'Compare prices across hospitals',
          'Look into government schemes for maternal care'
        ]
      },
      {
        patient_id: 'patient-2',
        condition_or_service: 'Diabetes Type 2',
        prediction_type: 'chronic_illness',
        predicted_cost: 85000,
        out_of_pocket_cost: 25000,
        insurance_coverage: 60000,
        confidence_level: 0.92,
        timeline_months: 12,
        cost_breakdown: {
          consultations: 24000,
          medications: 36000,
          diagnostics: 15000,
          procedures: 10000
        },
        recommendations: [
          'Join a diabetes management program',
          'Regular monitoring to prevent complications',
          'Focus on preventive care'
        ]
      }
    ];

    const { error: predictionsError } = await supabaseService
      .from('cost_predictions')
      .upsert(costPredictions);

    if (predictionsError) throw predictionsError;

    console.log('Demo data population completed successfully!');

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Mumbai demo data populated successfully',
      data: {
        profiles: demoProfiles.length,
        providers: providerProfiles.length,
        appointments: appointments.length,
        maternal_records: maternalRecords.length,
        pediatric_records: pediatricRecords.length,
        wellness_programs: wellnessPrograms.length,
        forums: forums.length,
        cost_predictions: costPredictions.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error populating demo data:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});