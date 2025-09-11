-- Comprehensive Mirai Health Platform Database Schema

-- Maternal & Women's Health
CREATE TABLE public.maternal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pregnancy_stage TEXT CHECK (pregnancy_stage IN ('preconception', 'prenatal', 'postnatal', 'lactation')),
  gestational_week INTEGER CHECK (gestational_week >= 0 AND gestational_week <= 42),
  expected_due_date DATE,
  actual_delivery_date DATE,
  pregnancy_complications JSONB DEFAULT '[]',
  vital_signs JSONB DEFAULT '{}',
  ultrasound_reports JSONB DEFAULT '[]',
  lab_results JSONB DEFAULT '[]',
  weight_tracking JSONB DEFAULT '[]',
  prenatal_vitamins JSONB DEFAULT '[]',
  lactation_data JSONB DEFAULT '{}',
  postpartum_checkups JSONB DEFAULT '[]',
  menstrual_cycle_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fertility & Family Planning
CREATE TABLE public.fertility_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  fertility_status TEXT CHECK (fertility_status IN ('trying_to_conceive', 'ivf_treatment', 'fertility_testing', 'family_planning')),
  ovulation_tracking JSONB DEFAULT '[]',
  basal_body_temperature JSONB DEFAULT '[]',
  fertility_medications JSONB DEFAULT '[]',
  ivf_cycles JSONB DEFAULT '[]',
  fertility_tests JSONB DEFAULT '[]',
  consultation_notes JSONB DEFAULT '[]',
  treatment_plan JSONB DEFAULT '{}',
  cost_estimates JSONB DEFAULT '{}',
  insurance_coverage JSONB DEFAULT '{}',
  success_probability DECIMAL(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pediatric Care
CREATE TABLE public.pediatric_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date DATE NOT NULL,
  birth_weight DECIMAL(5,2),
  birth_height DECIMAL(5,2),
  vaccination_schedule JSONB DEFAULT '[]',
  growth_milestones JSONB DEFAULT '[]',
  development_assessments JSONB DEFAULT '[]',
  feeding_schedule JSONB DEFAULT '{}',
  sleep_patterns JSONB DEFAULT '[]',
  behavioral_notes JSONB DEFAULT '[]',
  pediatrician_id UUID REFERENCES auth.users(id),
  emergency_contacts JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  medical_conditions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mental Health
CREATE TABLE public.mental_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES auth.users(id),
  assessment_type TEXT CHECK (assessment_type IN ('initial', 'follow_up', 'crisis', 'routine')),
  mood_tracking JSONB DEFAULT '[]',
  anxiety_levels JSONB DEFAULT '[]',
  depression_screening JSONB DEFAULT '{}',
  therapy_sessions JSONB DEFAULT '[]',
  medication_response JSONB DEFAULT '[]',
  coping_strategies JSONB DEFAULT '[]',
  support_system JSONB DEFAULT '{}',
  crisis_plan JSONB DEFAULT '{}',
  progress_notes JSONB DEFAULT '[]',
  treatment_goals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Labs Integration
CREATE TABLE public.lab_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lab_partner TEXT NOT NULL,
  test_types JSONB NOT NULL DEFAULT '[]',
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  sample_collection_date TIMESTAMPTZ,
  results_expected_date TIMESTAMPTZ,
  results_received_date TIMESTAMPTZ,
  test_results JSONB DEFAULT '{}',
  ai_interpretation JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  critical_values JSONB DEFAULT '[]',
  status TEXT CHECK (status IN ('ordered', 'sample_collected', 'processing', 'results_ready', 'interpreted')) DEFAULT 'ordered',
  cost DECIMAL(10,2),
  insurance_covered BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pharmacy Integration
CREATE TABLE public.pharmacy_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prescription_id UUID REFERENCES public.prescriptions(id),
  pharmacy_partner TEXT NOT NULL,
  medications JSONB NOT NULL DEFAULT '[]',
  order_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_date TIMESTAMPTZ,
  delivery_address JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  insurance_coverage DECIMAL(10,2) DEFAULT 0,
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
  delivery_status TEXT CHECK (delivery_status IN ('ordered', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')) DEFAULT 'ordered',
  tracking_number TEXT,
  delivery_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- AI Triage & Symptom Analysis
CREATE TABLE public.ai_triage_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('symptom_triage', 'health_risk_assessment', 'medication_review', 'lab_interpretation')),
  input_data JSONB NOT NULL DEFAULT '{}',
  ai_response JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  recommended_specialty TEXT,
  urgency_level TEXT CHECK (urgency_level IN ('emergency', 'urgent', 'moderate', 'low')),
  follow_up_recommendations JSONB DEFAULT '[]',
  provider_review_required BOOLEAN DEFAULT false,
  provider_id UUID REFERENCES auth.users(id),
  provider_notes TEXT,
  language_used TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Community & Wellness
CREATE TABLE public.community_forums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('general', 'maternal_health', 'mental_health', 'chronic_conditions', 'wellness', 'pediatric', 'fertility')),
  moderator_id UUID REFERENCES auth.users(id),
  is_moderated BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forum_id UUID NOT NULL REFERENCES public.community_forums(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('question', 'discussion', 'experience_sharing', 'expert_qa')),
  is_anonymous BOOLEAN DEFAULT false,
  tags JSONB DEFAULT '[]',
  upvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.forum_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_expert_reply BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wellness Programs
CREATE TABLE public.wellness_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  program_type TEXT CHECK (program_type IN ('fitness', 'nutrition', 'meditation', 'stress_management', 'chronic_disease', 'weight_management')),
  duration_weeks INTEGER NOT NULL,
  target_audience JSONB DEFAULT '[]',
  content JSONB NOT NULL DEFAULT '{}',
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  cost DECIMAL(10,2) DEFAULT 0,
  is_corporate_program BOOLEAN DEFAULT false,
  enrollment_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.program_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.wellness_programs(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'completed', 'paused', 'cancelled')) DEFAULT 'active',
  progress_data JSONB DEFAULT '{}',
  feedback JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Healthcare Providers Directory
CREATE TABLE public.healthcare_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider_type TEXT CHECK (provider_type IN ('hospital', 'clinic', 'lab', 'pharmacy', 'diagnostic_center')),
  specialties JSONB DEFAULT '[]',
  address JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  operating_hours JSONB DEFAULT '{}',
  services JSONB DEFAULT '[]',
  insurance_accepted JSONB DEFAULT '[]',
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  pricing_info JSONB DEFAULT '{}',
  is_partner BOOLEAN DEFAULT false,
  verification_status TEXT CHECK (verification_status IN ('verified', 'pending', 'rejected')) DEFAULT 'pending',
  location_coords POINT,
  city TEXT DEFAULT 'Mumbai',
  state TEXT DEFAULT 'Maharashtra',
  country TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insurance Integration
CREATE TABLE public.insurance_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider_code TEXT UNIQUE NOT NULL,
  api_endpoint TEXT,
  supported_services JSONB DEFAULT '[]',
  coverage_types JSONB DEFAULT '[]',
  network_hospitals JSONB DEFAULT '[]',
  contact_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.insurance_providers(id),
  policy_number TEXT NOT NULL,
  policy_type TEXT CHECK (policy_type IN ('individual', 'family', 'corporate')),
  coverage_amount DECIMAL(12,2),
  premium_amount DECIMAL(10,2),
  deductible_amount DECIMAL(10,2),
  copay_percentage DECIMAL(5,2),
  policy_start_date DATE NOT NULL,
  policy_end_date DATE NOT NULL,
  beneficiaries JSONB DEFAULT '[]',
  covered_services JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cost Predictions & Analytics
CREATE TABLE public.cost_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prediction_type TEXT CHECK (prediction_type IN ('chronic_illness', 'maternal_care', 'pediatric_care', 'fertility_treatment', 'wellness_program')),
  condition_or_service TEXT NOT NULL,
  predicted_cost DECIMAL(12,2) NOT NULL,
  cost_breakdown JSONB DEFAULT '{}',
  insurance_coverage DECIMAL(12,2) DEFAULT 0,
  out_of_pocket_cost DECIMAL(12,2) NOT NULL,
  timeline_months INTEGER,
  confidence_level DECIMAL(3,2),
  factors_considered JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risk Scoring
CREATE TABLE public.patient_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_risk_score INTEGER CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
  cardiovascular_risk INTEGER CHECK (cardiovascular_risk >= 0 AND cardiovascular_risk <= 100),
  diabetes_risk INTEGER CHECK (diabetes_risk >= 0 AND diabetes_risk <= 100),
  mental_health_risk INTEGER CHECK (mental_health_risk >= 0 AND mental_health_risk <= 100),
  chronic_disease_risk INTEGER CHECK (chronic_disease_risk >= 0 AND chronic_disease_risk <= 100),
  maternal_risk INTEGER CHECK (maternal_risk >= 0 AND maternal_risk <= 100),
  risk_factors JSONB DEFAULT '[]',
  protective_factors JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  next_assessment_date DATE,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Multilingual Support
CREATE TABLE public.translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'hi', 'mr')),
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entity_type, entity_id, field_name, language)
);

-- Enable Row Level Security
ALTER TABLE public.maternal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertility_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pediatric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_triage_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Maternal Records
CREATE POLICY "Users can view their own maternal records" ON public.maternal_records
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can insert their own maternal records" ON public.maternal_records
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own maternal records" ON public.maternal_records
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for Fertility Records
CREATE POLICY "Users can view their own fertility records" ON public.fertility_records
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = partner_id);

CREATE POLICY "Users can insert their own fertility records" ON public.fertility_records
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own fertility records" ON public.fertility_records
  FOR UPDATE USING (auth.uid() = patient_id OR auth.uid() = partner_id);

-- RLS Policies for Pediatric Records
CREATE POLICY "Parents can view their children's records" ON public.pediatric_records
  FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their children's records" ON public.pediatric_records
  FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their children's records" ON public.pediatric_records
  FOR UPDATE USING (auth.uid() = parent_id);

-- RLS Policies for Mental Health Records
CREATE POLICY "Users can view their own mental health records" ON public.mental_health_records
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Therapists can view patient records" ON public.mental_health_records
  FOR SELECT USING (auth.uid() = therapist_id);

CREATE POLICY "Users can insert their own mental health records" ON public.mental_health_records
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Therapists can insert patient records" ON public.mental_health_records
  FOR INSERT WITH CHECK (auth.uid() = therapist_id);

-- RLS Policies for Lab Orders
CREATE POLICY "Users can view their own lab orders" ON public.lab_orders
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Providers can create lab orders" ON public.lab_orders
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "Providers can update lab orders" ON public.lab_orders
  FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for Pharmacy Orders
CREATE POLICY "Users can view their own pharmacy orders" ON public.pharmacy_orders
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own pharmacy orders" ON public.pharmacy_orders
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own pharmacy orders" ON public.pharmacy_orders
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for AI Triage Sessions
CREATE POLICY "Users can view their own triage sessions" ON public.ai_triage_sessions
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = provider_id);

CREATE POLICY "Users can create triage sessions" ON public.ai_triage_sessions
  FOR INSERT WITH CHECK (auth.uid() = patient_id OR patient_id IS NULL);

CREATE POLICY "Providers can update triage sessions" ON public.ai_triage_sessions
  FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for Community Forums
CREATE POLICY "Forums are publicly viewable" ON public.community_forums
  FOR SELECT USING (true);

CREATE POLICY "Moderators can manage forums" ON public.community_forums
  FOR ALL USING (auth.uid() = moderator_id);

-- RLS Policies for Forum Posts
CREATE POLICY "Posts are publicly viewable" ON public.forum_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their posts" ON public.forum_posts
  FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for Forum Replies
CREATE POLICY "Replies are publicly viewable" ON public.forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Users can create replies" ON public.forum_replies
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their replies" ON public.forum_replies
  FOR UPDATE USING (auth.uid() = author_id);

-- RLS Policies for Wellness Programs
CREATE POLICY "Programs are publicly viewable" ON public.wellness_programs
  FOR SELECT USING (true);

-- RLS Policies for Program Enrollments
CREATE POLICY "Users can view their own enrollments" ON public.program_enrollments
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own enrollments" ON public.program_enrollments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own enrollments" ON public.program_enrollments
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for Healthcare Providers
CREATE POLICY "Providers are publicly viewable" ON public.healthcare_providers
  FOR SELECT USING (true);

-- RLS Policies for Insurance Providers
CREATE POLICY "Insurance providers are publicly viewable" ON public.insurance_providers
  FOR SELECT USING (true);

-- RLS Policies for Patient Insurance
CREATE POLICY "Users can view their own insurance" ON public.patient_insurance
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can manage their own insurance" ON public.patient_insurance
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own insurance" ON public.patient_insurance
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for Cost Predictions
CREATE POLICY "Users can view their own predictions" ON public.cost_predictions
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own predictions" ON public.cost_predictions
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- RLS Policies for Risk Scores
CREATE POLICY "Users can view their own risk scores" ON public.patient_risk_scores
  FOR SELECT USING (auth.uid() = patient_id);

-- RLS Policies for Translations
CREATE POLICY "Translations are publicly viewable" ON public.translations
  FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_maternal_records_updated_at
  BEFORE UPDATE ON public.maternal_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fertility_records_updated_at
  BEFORE UPDATE ON public.fertility_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pediatric_records_updated_at
  BEFORE UPDATE ON public.pediatric_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mental_health_records_updated_at
  BEFORE UPDATE ON public.mental_health_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lab_orders_updated_at
  BEFORE UPDATE ON public.lab_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pharmacy_orders_updated_at
  BEFORE UPDATE ON public.pharmacy_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_triage_sessions_updated_at
  BEFORE UPDATE ON public.ai_triage_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_forums_updated_at
  BEFORE UPDATE ON public.community_forums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
  BEFORE UPDATE ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_forum_replies_updated_at
  BEFORE UPDATE ON public.forum_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wellness_programs_updated_at
  BEFORE UPDATE ON public.wellness_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_program_enrollments_updated_at
  BEFORE UPDATE ON public.program_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_healthcare_providers_updated_at
  BEFORE UPDATE ON public.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_providers_updated_at
  BEFORE UPDATE ON public.insurance_providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_insurance_updated_at
  BEFORE UPDATE ON public.patient_insurance
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cost_predictions_updated_at
  BEFORE UPDATE ON public.cost_predictions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_risk_scores_updated_at
  BEFORE UPDATE ON public.patient_risk_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();