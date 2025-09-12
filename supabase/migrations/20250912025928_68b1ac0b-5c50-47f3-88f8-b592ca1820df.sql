-- Populate demo data for Mumbai healthcare ecosystem

-- Insert demo wellness programs
INSERT INTO wellness_programs (id, name, description, program_type, duration_weeks, difficulty_level, rating, enrollment_count, cost, content) VALUES
('program-1', 'Maternal Wellness Complete', 'Comprehensive prenatal and postnatal care program with AI monitoring', 'maternal', 40, 'beginner', 4.8, 156, 2500, '{"modules": ["Nutrition during pregnancy", "Exercise guidelines", "Mental health support", "Labor preparation"], "resources": ["Video sessions", "Meal plans", "Progress tracking", "24x7 support"]}'),
('program-2', 'Diabetes Management Pro', 'Advanced diabetes care and lifestyle management with continuous monitoring', 'chronic_disease', 12, 'intermediate', 4.6, 243, 1500, '{"modules": ["Diet planning", "Glucose monitoring", "Exercise routines", "Medication management"], "resources": ["Mobile app", "Glucose tracker", "Dietitian consultations", "Doctor reviews"]}'),
('program-3', 'Mental Wellness Journey', 'Comprehensive mental health support program with therapy sessions', 'mental_health', 16, 'beginner', 4.7, 189, 1800, '{"modules": ["Stress management", "Anxiety coping", "Depression support", "Mindfulness"], "resources": ["Therapy sessions", "Meditation guides", "Progress tracking", "Peer support"]}'),
('program-4', 'Fertility Care Path', 'Complete fertility support program with specialist guidance', 'fertility', 24, 'intermediate', 4.5, 78, 3500, '{"modules": ["Ovulation tracking", "Nutrition optimization", "Stress reduction", "IVF preparation"], "resources": ["Specialist consultations", "Tracking apps", "Support groups", "Educational content"]}'),
('program-5', 'Pediatric Growth Track', 'Child development and growth monitoring program for parents', 'pediatric', 52, 'beginner', 4.9, 298, 1200, '{"modules": ["Growth milestones", "Vaccination schedules", "Nutrition planning", "Development activities"], "resources": ["Growth charts", "Pediatrician access", "Parent community", "Educational videos"]}');

-- Insert community forums
INSERT INTO community_forums (id, name, description, category, post_count, member_count, moderator_id) VALUES
('forum-1', 'Maternal Health Mumbai', 'Support group for expectant and new mothers in Mumbai', 'maternal_health', 145, 428, 'provider-1'),
('forum-2', 'Diabetes Support India', 'Community for diabetes patients sharing experiences and tips', 'chronic_disease', 267, 803, 'provider-2'),
('forum-3', 'Mental Health Awareness', 'Safe space for mental health discussions and support', 'mental_health', 89, 234, 'provider-1'),
('forum-4', 'Fertility Journey Together', 'Support network for couples on fertility treatment', 'fertility', 167, 356, 'provider-2'),
('forum-5', 'Parenting in Mumbai', 'Parents sharing experiences about child care and development', 'pediatrics', 203, 567, 'provider-1');

-- Insert some sample forum posts
INSERT INTO forum_posts (id, forum_id, author_id, title, content, tags, is_anonymous) VALUES
('post-1', 'forum-1', 'patient-1', 'First trimester experiences in Mumbai hospitals', 'Sharing my experience with prenatal care at different hospitals in Mumbai. KEM Hospital has been excellent so far...', '["pregnancy", "mumbai", "hospitals"]', false),
('post-2', 'forum-2', 'patient-2', 'Managing diabetes during monsoon season', 'How do you all manage blood sugar levels during Mumbai monsoons? The humidity seems to affect my readings...', '["diabetes", "monsoon", "blood-sugar"]', false),
('post-3', 'forum-3', 'patient-1', 'Postpartum anxiety support', 'Looking for recommendations for postpartum mental health support in Mumbai. Has anyone tried online therapy?', '["postpartum", "anxiety", "therapy"]', true);

-- Update healthcare providers with more Mumbai-specific data
UPDATE healthcare_providers SET 
  name = 'Kokilaben Dhirubhai Ambani Hospital',
  provider_type = 'Multi-specialty Hospital',
  specialties = '["Cardiology", "Oncology", "Neurology", "Orthopedics", "Gastroenterology"]',
  services = '["Emergency Care", "ICU", "Surgery", "Diagnostics", "Pharmacy"]',
  address = '{"street": "Rao Saheb Achutrao Patwardhan Marg", "area": "Four Bunglows", "city": "Mumbai", "state": "Maharashtra", "pincode": "400053"}',
  contact_info = '{"phone": "+91-22-4269-6969", "email": "info@kokilabenhospital.com", "website": "www.kokilabenhospital.com"}',
  rating = 4.6,
  review_count = 2847,
  insurance_accepted = '["Star Health", "HDFC ERGO", "ICICI Lombard", "New India Assurance", "Oriental Insurance"]',
  operating_hours = '{"monday_friday": "24x7", "saturday": "24x7", "sunday": "24x7", "emergency": "24x7"}',
  pricing_info = '{"consultation": {"general": 800, "specialist": 1200}, "room_charges": {"general": 2500, "private": 8000, "icu": 15000}}'
WHERE id = (SELECT id FROM healthcare_providers LIMIT 1);

-- Insert more healthcare providers
INSERT INTO healthcare_providers (name, provider_type, specialties, services, address, contact_info, rating, review_count, insurance_accepted, operating_hours, pricing_info, location_coords, is_partner) VALUES
('Lilavati Hospital and Research Centre', 'Multi-specialty Hospital', '["Cardiology", "Neurosurgery", "Orthopedics", "Oncology", "Gastroenterology"]', '["Emergency Care", "Surgery", "Diagnostics", "ICU", "Rehabilitation"]', '{"street": "A-791, Bandra Reclamation", "area": "Bandra West", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}', '{"phone": "+91-22-2640-1000", "email": "info@lilavatihospital.com"}', 4.4, 1923, '["Star Health", "HDFC ERGO", "Max Bupa", "Care Health"]', '{"all_days": "24x7"}', '{"consultation": {"general": 700, "specialist": 1000}, "emergency": 2000}', point(72.8262, 19.0551), true),
('Breach Candy Hospital Trust', 'Multi-specialty Hospital', '["Cardiology", "Nephrology", "Pulmonology", "Endocrinology"]', '["Dialysis", "Surgery", "Diagnostics", "Pharmacy"]', '{"street": "60-A, Bhulabhai Desai Road", "area": "Breach Candy", "city": "Mumbai", "state": "Maharashtra", "pincode": "400026"}', '{"phone": "+91-22-2367-1888", "email": "info@breachcandyhospital.org"}', 4.3, 1567, '["ICICI Lombard", "Bajaj Allianz", "Oriental Insurance"]', '{"all_days": "24x7"}', '{"consultation": {"general": 900, "specialist": 1400}}', point(72.8089, 18.9667), true),
('Apollo Spectra Hospitals', 'Specialty Surgery Center', '["General Surgery", "Orthopedics", "Urology", "ENT", "Plastic Surgery"]', '["Day Care Surgery", "Diagnostics", "Physiotherapy"]', '{"street": "1st Floor, Paramount Plaza, Plot No. 16", "area": "Sector 30A, Vashi", "city": "Navi Mumbai", "state": "Maharashtra", "pincode": "400703"}', '{"phone": "+91-22-6882-0000", "email": "vashi@apollospectra.com"}', 4.2, 892, '["Star Health", "Care Health", "Future Generali"]', '{"monday_saturday": "8:00-20:00", "sunday": "9:00-17:00"}', '{"consultation": {"general": 600, "specialist": 800}, "surgery_packages": true}', point(73.0297, 19.0748), true);

-- Insert insurance providers with Mumbai focus
INSERT INTO insurance_providers (name, provider_code, coverage_types, supported_services, network_hospitals, contact_info) VALUES
('Star Health and Allied Insurance Co. Ltd.', 'STAR_HEALTH', '["Individual Health", "Family Floater", "Senior Citizen", "Maternity", "Critical Illness"]', '["Hospitalization", "Day Care", "Pre-Post Hospitalization", "Ambulance", "Health Checkup"]', '["Kokilaben Hospital", "Lilavati Hospital", "Breach Candy Hospital", "Jaslok Hospital", "Hinduja Hospital"]', '{"phone": "1800-425-2255", "email": "care@starhealth.in", "website": "www.starhealth.in"}'),
('HDFC ERGO General Insurance Company', 'HDFC_ERGO', '["Individual Health", "Family Health", "Group Health", "Travel Insurance"]', '["Cashless Treatment", "Reimbursement", "Emergency Services", "Telemedicine"]', '["All Major Mumbai Hospitals", "Network of 10000+ hospitals"]', '{"phone": "1800-2666", "email": "care@hdfcergo.com"}'),
('ICICI Lombard General Insurance', 'ICICI_LOMBARD', '["Complete Health Guard", "Family Health", "Senior Citizen", "Personal Accident"]', '["Hospitalization", "Pre-existing Diseases", "Maternity", "Mental Health"]', '["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Manipal Hospitals"]', '{"phone": "1800-2666", "email": "care@icicilombard.com"}');

-- Create sample insurance policies for demo patients
INSERT INTO patient_insurance (patient_id, provider_id, policy_number, policy_type, premium_amount, deductible_amount, coverage_amount, policy_start_date, policy_end_date, covered_services, exclusions) VALUES 
('patient-1', (SELECT id FROM insurance_providers WHERE name LIKE 'Star Health%' LIMIT 1), 'STAR2024001', 'Family Floater', 25000, 5000, 500000, '2024-01-01', '2024-12-31', '["Hospitalization", "Maternity", "Pre-Post Hospitalization", "Day Care Surgery", "Ambulance"]', '["Cosmetic Surgery", "Dental Treatment", "Pre-existing for 2 years"]'),
('patient-2', (SELECT id FROM insurance_providers WHERE name LIKE 'HDFC ERGO%' LIMIT 1), 'HDFC2024002', 'Individual Health', 18000, 3000, 300000, '2024-01-01', '2024-12-31', '["Hospitalization", "Day Care", "Emergency Services", "Health Checkup"]', '["Cosmetic Treatment", "Alternative Medicine", "Experimental Treatment"]');

-- Add AI triage sessions with multilingual examples
INSERT INTO ai_triage_sessions (patient_id, session_type, input_data, ai_response, confidence_score, recommended_specialty, urgency_level, language_used, provider_review_required) VALUES
('patient-1', 'symptom_triage', '{"symptoms": ["morning sickness", "fatigue", "missed period"], "demographics": {"age": 28, "gender": "female", "location": "Mumbai"}}', '{"urgency_level": "moderate", "recommended_specialty": "gynecology", "possible_conditions": ["Pregnancy", "Hormonal imbalance"], "recommendations": ["Take pregnancy test", "Consult gynecologist", "Monitor symptoms"], "language": "English"}', 0.89, 'gynecology', 'moderate', 'en', false),
('patient-2', 'symptom_triage', '{"symptoms": ["increased thirst", "frequent urination", "fatigue"], "demographics": {"age": 45, "gender": "male", "location": "Mumbai"}}', '{"urgency_level": "urgent", "recommended_specialty": "endocrinology", "possible_conditions": ["Type 2 Diabetes", "Pre-diabetes"], "recommendations": ["Blood sugar test immediately", "Consult endocrinologist within 24 hours", "Monitor fluid intake"], "language": "English"}', 0.92, 'endocrinology', 'urgent', 'en', true);

-- Populate demo lab orders
INSERT INTO lab_orders (patient_id, provider_id, test_types, lab_partner, order_date, results_expected_date, cost, insurance_covered, status) VALUES
('patient-1', 'provider-1', '["Complete Blood Count", "Thyroid Function", "Glucose Fasting", "Vitamin D"]', 'SRL Diagnostics', now() - interval '2 days', now() + interval '1 day', 1200, true, 'sample_collected'),
('patient-2', 'provider-2', '["HbA1c", "Lipid Profile", "Kidney Function", "Liver Function"]', 'Metropolis Healthcare', now() - interval '5 days', now() - interval '2 days', 1800, true, 'results_available');

-- Add some pharmacy orders
INSERT INTO pharmacy_orders (patient_id, pharmacy_partner, medications, total_amount, delivery_status, order_date, delivery_address) VALUES
('patient-1', 'Apollo Pharmacy', '[{"name": "Folic Acid", "dosage": "5mg", "quantity": 30, "price": 45}, {"name": "Iron Tablets", "dosage": "100mg", "quantity": 30, "price": 120}]', 190, 'delivered', now() - interval '3 days', '{"street": "204, Shivaji Nagar", "city": "Mumbai", "state": "Maharashtra", "pincode": "400017"}'),
('patient-2', 'Netmeds', '[{"name": "Metformin", "dosage": "500mg", "quantity": 30, "price": 45}, {"name": "Glimepiride", "dosage": "2mg", "quantity": 30, "price": 180}]', 250, 'shipped', now() - interval '1 day', '{"street": "15, Linking Road, Bandra", "city": "Mumbai", "state": "Maharashtra", "pincode": "400050"}');

-- Enable realtime for new tables
ALTER TABLE wellness_programs REPLICA IDENTITY FULL;
ALTER TABLE community_forums REPLICA IDENTITY FULL;
ALTER TABLE forum_posts REPLICA IDENTITY FULL;
ALTER TABLE program_enrollments REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE wellness_programs;
ALTER PUBLICATION supabase_realtime ADD TABLE community_forums;  
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE program_enrollments;