-- Fix the security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.create_dev_admin(
  dev_email TEXT,
  dev_password TEXT DEFAULT 'dev123456'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id UUID;
  result JSON;
BEGIN
  -- This would typically be called from an edge function
  -- For now, we'll just create the profile and role structure
  
  -- Generate a UUID for the user (in practice, this comes from auth.users)
  new_user_id := gen_random_uuid();
  
  -- Insert into profiles
  INSERT INTO public.profiles (
    user_id,
    institution_id,
    email,
    first_name,
    last_name,
    is_active
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000001',
    dev_email,
    'Developer',
    'Admin',
    true
  );
  
  -- Insert admin role
  INSERT INTO public.user_roles (
    user_id,
    institution_id,
    role
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000001',
    'admin'
  );
  
  result := json_build_object(
    'success', true,
    'user_id', new_user_id,
    'email', dev_email,
    'institution_id', '00000000-0000-0000-0000-000000000001'
  );
  
  RETURN result;
END;
$$;