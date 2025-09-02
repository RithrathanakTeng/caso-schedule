-- Add INSERT policy for institutions (for edge functions using service role)
CREATE POLICY "Allow service role to insert institutions" 
ON public.institutions 
FOR INSERT 
WITH CHECK (true);

-- Add INSERT policy for profiles (for edge functions using service role)  
CREATE POLICY "Allow service role to insert profiles"
ON public.profiles
FOR INSERT 
WITH CHECK (true);