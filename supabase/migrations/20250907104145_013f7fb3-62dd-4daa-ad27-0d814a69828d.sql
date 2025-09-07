-- Fix the circular dependency in profile RLS policies
-- The issue is that get_user_institution_id() depends on the profiles table
-- but we're trying to fetch from profiles table, creating a circular dependency

-- Drop the problematic policy and recreate it
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a simple policy that allows users to view their own profile by user_id
-- This avoids the circular dependency
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Also ensure the policy for viewing profiles in same institution works correctly
DROP POLICY IF EXISTS "Users can view profiles in their institution" ON public.profiles;

-- Recreate this policy but only for users who already have a profile (avoid circular dependency)
CREATE POLICY "Users can view profiles in their institution" 
ON public.profiles 
FOR SELECT 
USING (
  institution_id IN (
    SELECT p.institution_id 
    FROM public.profiles p 
    WHERE p.user_id = auth.uid()
  )
);