-- Fix the infinite recursion by completely recreating the profiles policies
-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view profiles in their institution" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can insert profiles in their institution" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role to insert profiles" ON public.profiles;

-- Create simple, non-recursive policies
-- 1. Users can view their own profile (no recursion)
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- 2. Users can update their own profile (no recursion)
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

-- 3. Service role can insert profiles (for user creation)
CREATE POLICY "Allow service role to insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- 4. Admins can view all profiles in their institution (using a safe approach)
CREATE POLICY "Admins can view all profiles in institution" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin' 
    AND ur.institution_id = profiles.institution_id
  )
);

-- 5. Admins can insert profiles in their institution
CREATE POLICY "Admins can insert profiles in their institution" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin' 
    AND ur.institution_id = profiles.institution_id
  )
);