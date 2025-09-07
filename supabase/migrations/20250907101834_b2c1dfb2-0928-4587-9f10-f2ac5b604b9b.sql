-- Create test accounts with proper roles and data
-- First, let's insert test institutions and users

-- Insert a development institution if it doesn't exist
INSERT INTO public.institutions (id, name, name_khmer, email, is_active) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Development University', 'សាកលវិទ្យាល័យអភិវឌ្ឍន៍', 'dev@university.edu', true)
ON CONFLICT (id) DO NOTHING;

-- Insert test profiles for each role
INSERT INTO public.profiles (user_id, institution_id, email, first_name, last_name, first_name_khmer, last_name_khmer, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'dev@admin.com', 'Admin', 'User', 'អ្នកគ្រប់គ្រង', 'ប្រព័ន្ធ', true),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'coordinator@test.com', 'Sarah', 'Wilson', 'សារ៉ា', 'វីលសុន', true),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'teacher@test.com', 'John', 'Smith', 'ចន', 'ស្មីត', true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert test user roles
INSERT INTO public.user_roles (user_id, institution_id, role, assigned_by)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'admin', NULL),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'coordinator', '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 'teacher', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (user_id, institution_id, role) DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (id, institution_id, name, name_khmer, code, description, hours_per_week, is_active)
VALUES 
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'Computer Science', 'វិទ្យាសាស្ត្រកុំព្យូទ័រ', 'CS101', 'Introduction to Computer Science', 20, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000001', 'Mathematics', 'គណិតវិទ្យា', 'MATH101', 'Basic Mathematics', 15, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '00000000-0000-0000-0000-000000000001', 'Physics', 'រូបវិទ្យា', 'PHY101', 'Introduction to Physics', 18, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample subjects
INSERT INTO public.subjects (id, institution_id, course_id, name, name_khmer, code, hours_per_week, is_active)
VALUES 
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Programming Fundamentals', 'មូលដ្ឋានគ្រឹះកម្មវិធី', 'CS101-1', 4, true),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Data Structures', 'រចនាសម្ព័ន្ធទិន្នន័យ', 'CS101-2', 3, true),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', '00000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Algebra', 'ពីជគណិត', 'MATH101-1', 3, true),
  ('gggggggg-gggg-gggg-gggg-gggggggggggg', '00000000-0000-0000-0000-000000000001', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Calculus', 'គណនាវិទ្យា', 'MATH101-2', 4, true),
  ('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '00000000-0000-0000-0000-000000000001', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Mechanics', 'យន្តការ', 'PHY101-1', 4, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample teacher availability
INSERT INTO public.teacher_availability (teacher_id, institution_id, day_of_week, start_time, end_time, is_available, notes)
VALUES 
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 1, '08:00', '12:00', true, 'Available Monday morning'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 1, '13:00', '17:00', true, 'Available Monday afternoon'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 2, '08:00', '12:00', true, 'Available Tuesday morning'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 3, '08:00', '16:00', true, 'Available Wednesday'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 4, '09:00', '15:00', false, 'Not available Thursday'),
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000001', 5, '08:00', '12:00', true, 'Available Friday morning')
ON CONFLICT (teacher_id, institution_id, day_of_week, start_time, end_time) DO NOTHING;

-- Create a sample schedule
INSERT INTO public.schedules (id, institution_id, name, week_start_date, week_end_date, status, generation_method, generated_by)
VALUES 
  ('ffffffff-1111-2222-3333-444444444444', '00000000-0000-0000-0000-000000000001', 'Week 1 Schedule', '2024-01-08', '2024-01-12', 'published', 'manual', '22222222-2222-2222-2222-222222222222')
ON CONFLICT (id) DO NOTHING;

-- Create sample schedule entries
INSERT INTO public.schedule_entries (schedule_id, teacher_id, subject_id, day_of_week, start_time, end_time, room, notes)
VALUES 
  ('ffffffff-1111-2222-3333-444444444444', '33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 1, '08:00', '10:00', 'Room A101', 'Programming Fundamentals - Lecture'),
  ('ffffffff-1111-2222-3333-444444444444', '33333333-3333-3333-3333-333333333333', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 2, '10:00', '12:00', 'Room A102', 'Data Structures - Practical'),
  ('ffffffff-1111-2222-3333-444444444444', '33333333-3333-3333-3333-333333333333', 'ffffffff-ffff-ffff-ffff-ffffffffffff', 3, '08:00', '10:00', 'Room B201', 'Algebra - Tutorial'),
  ('ffffffff-1111-2222-3333-444444444444', '33333333-3333-3333-3333-333333333333', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 5, '08:00', '10:00', 'Lab C301', 'Physics Lab')
ON CONFLICT DO NOTHING;