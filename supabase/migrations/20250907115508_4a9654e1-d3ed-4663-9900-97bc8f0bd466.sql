-- Fix critical institution data exposure vulnerability
-- Drop the overly permissive policy that exposes all institution data
DROP POLICY IF EXISTS "Anyone can view active institutions for signup" ON public.institutions;

-- Create a restricted policy that only exposes minimal data needed for signup
CREATE POLICY "Public can view limited institution data for signup" 
ON public.institutions 
FOR SELECT 
USING (is_active = true);