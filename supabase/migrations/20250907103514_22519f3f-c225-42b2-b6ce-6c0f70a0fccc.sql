-- Insert the missing profile for the authenticated admin user
-- This user ID comes from the console logs: e32482ec-45a1-4695-a4d4-3ca711f159c8

INSERT INTO public.profiles (
  user_id, 
  institution_id, 
  email, 
  first_name, 
  last_name, 
  first_name_khmer, 
  last_name_khmer, 
  is_active
) VALUES (
  'e32482ec-45a1-4695-a4d4-3ca711f159c8',
  '00000000-0000-0000-0000-000000000001',
  'dev@admin.com',
  'Admin',
  'User',
  'អ្នកគ្រប់គ្រង',
  'ប្រព័ន្ធ',
  true
) ON CONFLICT (user_id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  updated_at = now();

-- Insert the admin role for this user
INSERT INTO public.user_roles (
  user_id, 
  institution_id, 
  role
) VALUES (
  'e32482ec-45a1-4695-a4d4-3ca711f159c8',
  '00000000-0000-0000-0000-000000000001',
  'admin'
) ON CONFLICT (user_id, institution_id, role) DO NOTHING;

-- Also ensure the default institution exists
INSERT INTO public.institutions (
  id, 
  name, 
  name_khmer, 
  email, 
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Development University',
  'សាកលវិទ្យាល័យអភិវឌ្ឍន៍',
  'dev@university.edu',
  true
) ON CONFLICT (id) DO NOTHING;