-- Add children role to app_role enum
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
    WHERE t.typname = 'app_role' AND e.enumlabel = 'children'
  ) THEN
    ALTER TYPE app_role ADD VALUE 'children';
  END IF;
END $$;

-- Create children_profiles table for additional child-specific data
CREATE TABLE IF NOT EXISTS public.children_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES auth.users(id),
  age INTEGER,
  avatar_character TEXT DEFAULT 'friendly_bear',
  grade_level TEXT,
  school_name TEXT,
  injury_date DATE,
  injury_type TEXT,
  accessibility_settings JSONB DEFAULT '{"textToSpeech": false, "largerFonts": false, "dyslexiaFriendly": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create symptom_logs table for daily tracking
CREATE TABLE IF NOT EXISTS public.symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  headache_level INTEGER CHECK (headache_level BETWEEN 0 AND 10),
  dizziness_level INTEGER CHECK (dizziness_level BETWEEN 0 AND 10),
  memory_issues BOOLEAN DEFAULT false,
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 5),
  notes TEXT,
  stickers_earned JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(child_id, log_date)
);

-- Create rehabilitation_activities table
CREATE TABLE IF NOT EXISTS public.rehabilitation_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'cognitive' or 'physical'
  activity_name TEXT NOT NULL,
  score INTEGER,
  duration_minutes INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  badges_earned JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create caregiver_notes table
CREATE TABLE IF NOT EXISTS public.caregiver_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES auth.users(id),
  note_type TEXT DEFAULT 'general', -- 'general', 'medication', 'observation', 'milestone'
  content TEXT NOT NULL,
  reminder_date DATE,
  is_shared_with_school BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_accommodations table
CREATE TABLE IF NOT EXISTS public.school_accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accommodation_type TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  approved_by_school BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.children_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rehabilitation_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_accommodations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for children_profiles
CREATE POLICY "Children can view their own profile"
  ON public.children_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can view their children's profiles"
  ON public.children_profiles FOR SELECT
  USING (auth.uid() = parent_id);

CREATE POLICY "Children can update their own profile"
  ON public.children_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Parents can manage their children's profiles"
  ON public.children_profiles FOR ALL
  USING (auth.uid() = parent_id);

-- RLS Policies for symptom_logs
CREATE POLICY "Children can manage their symptom logs"
  ON public.symptom_logs FOR ALL
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can view children's symptom logs"
  ON public.symptom_logs FOR SELECT
  USING (auth.uid() IN (
    SELECT parent_id FROM children_profiles WHERE user_id = child_id
  ));

-- RLS Policies for rehabilitation_activities
CREATE POLICY "Children can manage their activities"
  ON public.rehabilitation_activities FOR ALL
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can view children's activities"
  ON public.rehabilitation_activities FOR SELECT
  USING (auth.uid() IN (
    SELECT parent_id FROM children_profiles WHERE user_id = child_id
  ));

-- RLS Policies for caregiver_notes
CREATE POLICY "Caregivers can manage their notes"
  ON public.caregiver_notes FOR ALL
  USING (auth.uid() = caregiver_id);

CREATE POLICY "Children can view notes about them"
  ON public.caregiver_notes FOR SELECT
  USING (auth.uid() = child_id);

-- RLS Policies for school_accommodations
CREATE POLICY "Children can view their accommodations"
  ON public.school_accommodations FOR SELECT
  USING (auth.uid() = child_id);

CREATE POLICY "Parents can manage children's accommodations"
  ON public.school_accommodations FOR ALL
  USING (auth.uid() IN (
    SELECT parent_id FROM children_profiles WHERE user_id = child_id
  ));

-- Create indexes for performance
CREATE INDEX idx_symptom_logs_child_date ON symptom_logs(child_id, log_date DESC);
CREATE INDEX idx_rehab_activities_child ON rehabilitation_activities(child_id, completed_at DESC);
CREATE INDEX idx_caregiver_notes_child ON caregiver_notes(child_id, created_at DESC);
CREATE INDEX idx_school_accommodations_child ON school_accommodations(child_id, is_active);

-- Trigger for updated_at
CREATE TRIGGER update_children_profiles_updated_at
  BEFORE UPDATE ON children_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_caregiver_notes_updated_at
  BEFORE UPDATE ON caregiver_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();