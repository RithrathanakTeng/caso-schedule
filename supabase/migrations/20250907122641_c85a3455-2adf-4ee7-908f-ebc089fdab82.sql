-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Users can view profiles in their institution" ON public.profiles;

-- Create a new policy without recursion using a direct join
CREATE POLICY "Users can view profiles in their institution" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.profiles my_profile 
    WHERE my_profile.user_id = auth.uid() 
    AND my_profile.institution_id = profiles.institution_id
  )
);

-- Also ensure the get_user_institution_id function is properly defined without recursion
CREATE OR REPLACE FUNCTION public.get_user_institution_id(user_uuid uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT institution_id 
  FROM public.profiles 
  WHERE user_id = user_uuid
  LIMIT 1;
$$;