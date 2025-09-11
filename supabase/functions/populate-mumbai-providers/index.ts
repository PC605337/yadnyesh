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

    // Mumbai healthcare providers data
    const providers = [
      // Hospitals
      {
        name: "Lilavati Hospital and Research Centre",
        provider_type: "hospital",
        specialties: ["Cardiology", "Oncology", "Neurology", "Orthopedics", "Emergency Medicine"],
        address: {
          street: "A-791, Bandra Reclamation, Bandra West",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          landmark: "Near Bandra Kurla Complex"
        },
        contact_info: {
          phone: "+91-22-2675-1000",
          website: "www.lilavatihospital.com",
          email: "info@lilavatihospital.com"
        },
        operating_hours: {
          "monday_friday": "24 hours",
          "saturday": "24 hours", 
          "sunday": "24 hours"
        },
        services: ["Emergency Care", "ICU", "Surgery", "Diagnostics", "Pharmacy"],
        insurance_accepted: ["ICICI Lombard", "HDFC ERGO", "Star Health", "Max Bupa"],
        rating: 4.3,
        review_count: 1250,
        is_partner: true,
        verification_status: "verified"
      },
      {
        name: "Kokilaben Dhirubhai Ambani Hospital",
        provider_type: "hospital",
        specialties: ["Cardiac Sciences", "Neurosciences", "Oncology", "Transplant", "Robotic Surgery"],
        address: {
          street: "Rao Saheb, Achutrao Patwardhan Marg, Four Bunglows",
          city: "Mumbai",
          state: "Maharashtra", 
          pincode: "400053",
          landmark: "Andheri West"
        },
        contact_info: {
          phone: "+91-22-4269-6969",
          website: "www.kokilabenhospital.com",
          email: "info@kokilabenhospital.com"
        },
        services: ["Emergency Care", "ICU", "Surgery", "Diagnostics", "Rehabilitation"],
        insurance_accepted: ["ICICI Lombard", "HDFC ERGO", "Star Health", "New India Assurance"],
        rating: 4.5,
        review_count: 2100,
        is_partner: true,
        verification_status: "verified"
      },
      {
        name: "Breach Candy Hospital Trust",
        provider_type: "hospital", 
        specialties: ["General Medicine", "Surgery", "Obstetrics", "Pediatrics", "Cardiology"],
        address: {
          street: "60A, Bhulabhai Desai Marg, Breach Candy",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400026",
          landmark: "Near Mahalaxmi Station"
        },
        contact_info: {
          phone: "+91-22-2367-1888",
          website: "www.breachcandyhospital.org",
          email: "info@bcht.org"
        },
        services: ["Emergency Care", "Maternity", "Surgery", "Diagnostics"],
        insurance_accepted: ["ICICI Lombard", "HDFC ERGO", "Star Health"],
        rating: 4.2,
        review_count: 890,
        is_partner: true,
        verification_status: "verified"
      },

      // Clinics
      {
        name: "Apollo Clinic Bandra",
        provider_type: "clinic",
        specialties: ["General Medicine", "Dermatology", "Gynecology", "Pediatrics"],
        address: {
          street: "Shop No 1-6, Morya Landmark, S V Road",
          city: "Mumbai", 
          state: "Maharashtra",
          pincode: "400050",
          landmark: "Bandra West"
        },
        contact_info: {
          phone: "+91-22-2640-3040",
          website: "www.apolloclinic.com",
          email: "bandra@apolloclinic.com"
        },
        operating_hours: {
          "monday_friday": "7:00 AM - 10:00 PM",
          "saturday": "8:00 AM - 8:00 PM",
          "sunday": "9:00 AM - 6:00 PM"
        },
        services: ["Consultation", "Minor Procedures", "Health Checkups", "Vaccination"],
        insurance_accepted: ["Most insurance accepted"],
        rating: 4.1,
        review_count: 450,
        is_partner: true,
        verification_status: "verified"
      },

      // Diagnostic Centers
      {
        name: "Dr. Lal Pathlabs Andheri",
        provider_type: "lab",
        specialties: ["Pathology", "Radiology", "Cardiology Tests", "Specialized Tests"],
        address: {
          street: "Shop No. 8, Mahavir Nagar, Kandivali West",
          city: "Mumbai",
          state: "Maharashtra", 
          pincode: "400067",
          landmark: "Near Kandivali Station"
        },
        contact_info: {
          phone: "+91-22-2806-6969",
          website: "www.lalpathlabs.com",
          email: "mumbai@lalpathlabs.com"
        },
        operating_hours: {
          "monday_friday": "7:00 AM - 7:00 PM",
          "saturday": "7:00 AM - 5:00 PM",
          "sunday": "8:00 AM - 2:00 PM"
        },
        services: ["Blood Tests", "Urine Analysis", "X-Ray", "ECG", "Home Collection"],
        pricing_info: {
          "blood_test_basic": "₹500-1500",
          "comprehensive_checkup": "₹3000-8000",
          "home_collection": "₹100 extra"
        },
        insurance_accepted: ["Most insurance accepted"],
        rating: 4.0,
        review_count: 680,
        is_partner: true,
        verification_status: "verified"
      },
      {
        name: "Thyrocare Mumbai Central",
        provider_type: "lab",
        specialties: ["Thyroid Tests", "Diabetes Panel", "Lipid Profile", "Comprehensive Health Checkup"],
        address: {
          street: "A-104, TTC Industrial Area, Mahape",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400710", 
          landmark: "Navi Mumbai"
        },
        contact_info: {
          phone: "+91-22-6784-6784",
          website: "www.thyrocare.com",
          email: "info@thyrocare.com"
        },
        services: ["Blood Tests", "Home Collection", "Corporate Packages", "Wellness Packages"],
        pricing_info: {
          "thyroid_profile": "₹400-800",
          "diabetes_screening": "₹300-600", 
          "full_body_checkup": "₹2000-5000"
        },
        rating: 4.2,
        review_count: 1200,
        is_partner: true,
        verification_status: "verified"
      },

      // Pharmacies
      {
        name: "Apollo Pharmacy Bandra",
        provider_type: "pharmacy",
        specialties: ["Prescription Medicines", "OTC Products", "Healthcare Products", "Online Orders"],
        address: {
          street: "Ground Floor, Hill Road",
          city: "Mumbai",
          state: "Maharashtra",
          pincode: "400050",
          landmark: "Bandra West"
        },
        contact_info: {
          phone: "+91-22-2644-4444",
          website: "www.apollopharmacy.in",
          email: "bandra@apollopharmacy.in"
        },
        operating_hours: {
          "monday_friday": "8:00 AM - 11:00 PM",
          "saturday": "8:00 AM - 11:00 PM",
          "sunday": "9:00 AM - 10:00 PM"
        },
        services: ["Medicine Delivery", "Online Orders", "Health Products", "Consultation"],
        pricing_info: {
          "prescription_medicines": "10-20% discount",
          "otc_products": "5-15% discount",
          "delivery_charges": "₹50 (free above ₹500)"
        },
        rating: 4.3,
        review_count: 890,
        is_partner: true,
        verification_status: "verified"
      },
      {
        name: "MedPlus Andheri",
        provider_type: "pharmacy",
        specialties: ["Prescription Medicines", "Generic Medicines", "Wellness Products"],
        address: {
          street: "Shop 15, Oshiwara Industrial Center",
          city: "Mumbai", 
          state: "Maharashtra",
          pincode: "400053",
          landmark: "Andheri West"
        },
        contact_info: {
          phone: "+91-22-4076-4076",
          website: "www.medplusmart.com",
          email: "andheri@medplus.in"
        },
        services: ["Medicine Delivery", "Generic Alternatives", "Health Checkups", "Digital Prescriptions"],
        pricing_info: {
          "generic_medicines": "20-40% cheaper",
          "branded_medicines": "10-15% discount",
          "home_delivery": "Free above ₹300"
        },
        rating: 4.1,
        review_count: 560,
        is_partner: true,
        verification_status: "verified"
      },
      {
        name: "1mg Meds Delivery Powai",
        provider_type: "pharmacy",
        specialties: ["Online Medicine Orders", "Health Products", "Lab Tests", "Consultations"],
        address: {
          street: "Hiranandani Gardens, Powai",
          city: "Mumbai",
          state: "Maharashtra", 
          pincode: "400076",
          landmark: "Near Galleria Mall"
        },
        contact_info: {
          phone: "+91-22-6208-1111",
          website: "www.1mg.com",
          email: "support@1mg.com"
        },
        services: ["24x7 Delivery", "Online Lab Tests", "Doctor Consultations", "Health Records"],
        pricing_info: {
          "medicines": "Up to 25% discount",
          "lab_tests": "Up to 70% discount", 
          "delivery": "Free above ₹199"
        },
        rating: 4.4,
        review_count: 2500,
        is_partner: true,
        verification_status: "verified"
      }
    ];

    // Insert providers
    const { data: insertedProviders, error: providersError } = await supabaseService
      .from('healthcare_providers')
      .insert(providers);

    if (providersError) {
      throw providersError;
    }

    // Mumbai insurance providers
    const insuranceProviders = [
      {
        name: "ICICI Lombard General Insurance",
        provider_code: "ICICI_LOMBARD",
        supported_services: ["Hospitalization", "OPD", "Pharmacy", "Diagnostics", "Maternity"],
        coverage_types: ["Individual", "Family", "Corporate", "Senior Citizen"],
        network_hospitals: ["Lilavati Hospital", "Kokilaben Hospital", "Breach Candy Hospital"],
        contact_info: {
          phone: "1800-2666",
          website: "www.icicilombard.com",
          email: "care@icicilombard.com"
        }
      },
      {
        name: "HDFC ERGO General Insurance",
        provider_code: "HDFC_ERGO", 
        supported_services: ["Hospitalization", "Critical Illness", "Maternity", "OPD"],
        coverage_types: ["Individual", "Family", "Group"],
        network_hospitals: ["Kokilaben Hospital", "Apollo Hospitals", "Fortis Healthcare"],
        contact_info: {
          phone: "1800-2700-700",
          website: "www.hdfcergo.com",
          email: "care@hdfcergo.com"
        }
      },
      {
        name: "Star Health and Allied Insurance",
        provider_code: "STAR_HEALTH",
        supported_services: ["Hospitalization", "OPD", "Pharmacy", "Health Checkups", "Maternity"],
        coverage_types: ["Individual", "Family", "Senior Citizen", "Diabetes Care"],
        network_hospitals: ["Breach Candy Hospital", "Lilavati Hospital", "Wockhardt Hospitals"],
        contact_info: {
          phone: "1800-425-2255",
          website: "www.starhealth.in", 
          email: "info@starhealth.in"
        }
      },
      {
        name: "Max Bupa Health Insurance",
        provider_code: "MAX_BUPA",
        supported_services: ["Hospitalization", "OPD", "Critical Care", "Preventive Care"],
        coverage_types: ["Individual", "Family", "Group"],
        network_hospitals: ["Max Healthcare", "Apollo Hospitals", "Fortis Healthcare"],
        contact_info: {
          phone: "1800-102-4488",
          website: "www.maxbupa.com",
          email: "customercare@maxbupa.com"
        }
      },
      {
        name: "New India Assurance Company",
        provider_code: "NEW_INDIA",
        supported_services: ["Hospitalization", "OPD", "Maternity", "Accidental Coverage"],
        coverage_types: ["Individual", "Family", "Mediclaim", "Cancer Care"],
        network_hospitals: ["Government Hospitals", "Private Network"],
        contact_info: {
          phone: "1800-209-1415",
          website: "www.newindia.co.in",
          email: "ho@newindia.co.in"
        }
      }
    ];

    // Insert insurance providers
    const { data: insertedInsurance, error: insuranceError } = await supabaseService
      .from('insurance_providers')
      .insert(insuranceProviders);

    if (insuranceError) {
      throw insuranceError;
    }

    return new Response(JSON.stringify({ 
      message: 'Mumbai healthcare providers populated successfully',
      providers_count: providers.length,
      insurance_providers_count: insuranceProviders.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error populating providers:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});