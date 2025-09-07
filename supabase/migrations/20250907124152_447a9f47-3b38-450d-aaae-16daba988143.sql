-- Temporarily disable RLS to test if that's the issue
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Test if the user can now query their profile
-- This is just for debugging, we'll re-enable RLS after testing