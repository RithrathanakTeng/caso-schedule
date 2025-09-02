-- Create institutions table for multi-tenancy
CREATE TABLE public.institutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_khmer TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  address_khmer TEXT,
  website TEXT,
  logo_url TEXT,
  settings JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enum for user roles
CREATE TYPE public.user_role AS ENUM ('admin', 'coordinator', 'teacher');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_name_khmer TEXT,
  last_name_khmer TEXT,
  phone TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, institution_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_institution_id(user_uuid UUID)
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT institution_id FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles(user_uuid UUID, inst_id UUID)
RETURNS user_role[]
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT ARRAY_AGG(role) FROM public.user_roles 
  WHERE user_id = user_uuid AND institution_id = inst_id;
$$;

CREATE OR REPLACE FUNCTION public.has_role(user_uuid UUID, inst_id UUID, required_role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid 
    AND institution_id = inst_id 
    AND role = required_role
  );
$$;

-- RLS Policies for institutions
CREATE POLICY "Users can view their institution" 
ON public.institutions 
FOR SELECT 
USING (id = public.get_user_institution_id(auth.uid()));

CREATE POLICY "Admins can update their institution" 
ON public.institutions 
FOR UPDATE 
USING (
  id = public.get_user_institution_id(auth.uid()) 
  AND public.has_role(auth.uid(), id, 'admin')
);

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their institution" 
ON public.profiles 
FOR SELECT 
USING (institution_id = public.get_user_institution_id(auth.uid()));

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can insert profiles in their institution" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  institution_id = public.get_user_institution_id(auth.uid()) 
  AND public.has_role(auth.uid(), institution_id, 'admin')
);

-- RLS Policies for user_roles
CREATE POLICY "Users can view roles in their institution" 
ON public.user_roles 
FOR SELECT 
USING (institution_id = public.get_user_institution_id(auth.uid()));

CREATE POLICY "Admins can manage roles in their institution" 
ON public.user_roles 
FOR ALL 
USING (
  institution_id = public.get_user_institution_id(auth.uid()) 
  AND public.has_role(auth.uid(), institution_id, 'admin')
);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  institution_uuid UUID;
BEGIN
  -- Extract institution_id from user metadata
  institution_uuid := (NEW.raw_user_meta_data ->> 'institution_id')::UUID;
  
  -- Insert profile
  INSERT INTO public.profiles (
    user_id, 
    institution_id, 
    email, 
    first_name, 
    last_name,
    first_name_khmer,
    last_name_khmer
  ) VALUES (
    NEW.id,
    institution_uuid,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    NEW.raw_user_meta_data ->> 'first_name_khmer',
    NEW.raw_user_meta_data ->> 'last_name_khmer'
  );
  
  -- Insert role (default to 'teacher' unless specified)
  INSERT INTO public.user_roles (
    user_id, 
    institution_id, 
    role,
    assigned_by
  ) VALUES (
    NEW.id,
    institution_uuid,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::user_role, 'teacher'),
    (NEW.raw_user_meta_data ->> 'assigned_by')::UUID
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_institutions_updated_at
  BEFORE UPDATE ON public.institutions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample institution for testing
INSERT INTO public.institutions (name, name_khmer, email, phone, address, address_khmer)
VALUES (
  'Royal University of Cambodia', 
  'សាកលវិទ្យាល័យព្រះរាជបុត្តាកម្ពុជា',
  'info@ruc.edu.kh',
  '+855 23 884 058',
  'Russian Federation Blvd, Phnom Penh',
  'ផ្លូវសហព័ន្ធរុស្ស៊ី ភ្នំពេញ'
);