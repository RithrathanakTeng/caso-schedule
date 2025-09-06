-- Add a policy to allow anyone to view active institutions for signup
CREATE POLICY "Anyone can view active institutions for signup" 
ON public.institutions 
FOR SELECT 
USING (is_active = true);