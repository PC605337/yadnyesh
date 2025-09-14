-- Fix the previous migration by using proper UUIDs for demo data

-- First, let's insert wellness programs with proper UUIDs
INSERT INTO wellness_programs (name, description, program_type, duration_weeks, difficulty_level, rating, enrollment_count, cost, content) VALUES
('Maternal Wellness Complete', 'Comprehensive prenatal and postnatal care program with AI monitoring', 'maternal', 40, 'beginner', 4.8, 156, 2500, '{"modules": ["Nutrition during pregnancy", "Exercise guidelines", "Mental health support", "Labor preparation"], "resources": ["Video sessions", "Meal plans", "Progress tracking", "24x7 support"]}'),
('Diabetes Management Pro', 'Advanced diabetes care and lifestyle management with continuous monitoring', 'chronic_disease', 12, 'intermediate', 4.6, 243, 1500, '{"modules": ["Diet planning", "Glucose monitoring", "Exercise routines", "Medication management"], "resources": ["Mobile app", "Glucose tracker", "Dietitian consultations", "Doctor reviews"]}'),
('Mental Wellness Journey', 'Comprehensive mental health support program with therapy sessions', 'mental_health', 16, 'beginner', 4.7, 189, 1800, '{"modules": ["Stress management", "Anxiety coping", "Depression support", "Mindfulness"], "resources": ["Therapy sessions", "Meditation guides", "Progress tracking", "Peer support"]}'),
('Fertility Care Path', 'Complete fertility support program with specialist guidance', 'fertility', 24, 'intermediate', 4.5, 78, 3500, '{"modules": ["Ovulation tracking", "Nutrition optimization", "Stress reduction", "IVF preparation"], "resources": ["Specialist consultations", "Tracking apps", "Support groups", "Educational content"]}'),
('Pediatric Growth Track', 'Child development and growth monitoring program for parents', 'pediatric', 52, 'beginner', 4.9, 298, 1200, '{"modules": ["Growth milestones", "Vaccination schedules", "Nutrition planning", "Development activities"], "resources": ["Growth charts", "Pediatrician access", "Parent community", "Educational videos"]}');

-- Insert community forums
INSERT INTO community_forums (name, description, category, post_count, member_count) VALUES
('Maternal Health Mumbai', 'Support group for expectant and new mothers in Mumbai', 'maternal_health', 145, 428),
('Diabetes Support India', 'Community for diabetes patients sharing experiences and tips', 'chronic_disease', 267, 803),
('Mental Health Awareness', 'Safe space for mental health discussions and support', 'mental_health', 89, 234),
('Fertility Journey Together', 'Support network for couples on fertility treatment', 'fertility', 167, 356),
('Parenting in Mumbai', 'Parents sharing experiences about child care and development', 'pediatrics', 203, 567);

-- Enable realtime for tables
ALTER TABLE wellness_programs REPLICA IDENTITY FULL;
ALTER TABLE community_forums REPLICA IDENTITY FULL;
ALTER TABLE forum_posts REPLICA IDENTITY FULL;
ALTER TABLE program_enrollments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE wellness_programs;
ALTER PUBLICATION supabase_realtime ADD TABLE community_forums;  
ALTER PUBLICATION supabase_realtime ADD TABLE forum_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE program_enrollments;