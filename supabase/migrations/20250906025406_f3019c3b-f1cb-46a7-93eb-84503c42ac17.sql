-- Create tables for scheduling functionality

-- Courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL,
  name TEXT NOT NULL,
  name_khmer TEXT,
  code TEXT,
  description TEXT,
  hours_per_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  institution_id UUID NOT NULL,
  name TEXT NOT NULL,
  name_khmer TEXT,
  code TEXT,
  hours_per_week INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Teacher availability table
CREATE TABLE public.teacher_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  institution_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schedules table
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL,
  name TEXT NOT NULL,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  generated_by UUID,
  generation_method TEXT DEFAULT 'manual' CHECK (generation_method IN ('manual', 'ai')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Schedule entries table
CREATE TABLE public.schedule_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Conflicts table
CREATE TABLE public.schedule_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('teacher_double_booking', 'room_double_booking', 'teacher_unavailable')),
  description TEXT NOT NULL,
  entry_ids UUID[] NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_conflicts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for courses
CREATE POLICY "Users can view courses in their institution" 
ON public.courses 
FOR SELECT 
USING (institution_id = get_user_institution_id(auth.uid()));

CREATE POLICY "Coordinators and admins can manage courses" 
ON public.courses 
FOR ALL 
USING (
  institution_id = get_user_institution_id(auth.uid()) AND 
  (has_role(auth.uid(), institution_id, 'coordinator') OR has_role(auth.uid(), institution_id, 'admin'))
);

-- RLS Policies for subjects
CREATE POLICY "Users can view subjects in their institution" 
ON public.subjects 
FOR SELECT 
USING (institution_id = get_user_institution_id(auth.uid()));

CREATE POLICY "Coordinators and admins can manage subjects" 
ON public.subjects 
FOR ALL 
USING (
  institution_id = get_user_institution_id(auth.uid()) AND 
  (has_role(auth.uid(), institution_id, 'coordinator') OR has_role(auth.uid(), institution_id, 'admin'))
);

-- RLS Policies for teacher availability
CREATE POLICY "Teachers can manage their own availability" 
ON public.teacher_availability 
FOR ALL 
USING (
  teacher_id = auth.uid() AND 
  institution_id = get_user_institution_id(auth.uid())
);

CREATE POLICY "Coordinators and admins can view all availability" 
ON public.teacher_availability 
FOR SELECT 
USING (
  institution_id = get_user_institution_id(auth.uid()) AND 
  (has_role(auth.uid(), institution_id, 'coordinator') OR has_role(auth.uid(), institution_id, 'admin'))
);

-- RLS Policies for schedules
CREATE POLICY "Users can view schedules in their institution" 
ON public.schedules 
FOR SELECT 
USING (institution_id = get_user_institution_id(auth.uid()));

CREATE POLICY "Coordinators and admins can manage schedules" 
ON public.schedules 
FOR ALL 
USING (
  institution_id = get_user_institution_id(auth.uid()) AND 
  (has_role(auth.uid(), institution_id, 'coordinator') OR has_role(auth.uid(), institution_id, 'admin'))
);

-- RLS Policies for schedule entries
CREATE POLICY "Users can view schedule entries in their institution" 
ON public.schedule_entries 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.schedules s 
    WHERE s.id = schedule_id AND s.institution_id = get_user_institution_id(auth.uid())
  )
);

CREATE POLICY "Coordinators and admins can manage schedule entries" 
ON public.schedule_entries 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.schedules s 
    WHERE s.id = schedule_id AND s.institution_id = get_user_institution_id(auth.uid()) AND
    (has_role(auth.uid(), s.institution_id, 'coordinator') OR has_role(auth.uid(), s.institution_id, 'admin'))
  )
);

-- RLS Policies for conflicts
CREATE POLICY "Users can view conflicts in their institution" 
ON public.schedule_conflicts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.schedules s 
    WHERE s.id = schedule_id AND s.institution_id = get_user_institution_id(auth.uid())
  )
);

CREATE POLICY "Coordinators and admins can manage conflicts" 
ON public.schedule_conflicts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.schedules s 
    WHERE s.id = schedule_id AND s.institution_id = get_user_institution_id(auth.uid()) AND
    (has_role(auth.uid(), s.institution_id, 'coordinator') OR has_role(auth.uid(), s.institution_id, 'admin'))
  )
);

-- Update triggers for all tables
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subjects_updated_at
BEFORE UPDATE ON public.subjects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teacher_availability_updated_at
BEFORE UPDATE ON public.teacher_availability
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at
BEFORE UPDATE ON public.schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schedule_entries_updated_at
BEFORE UPDATE ON public.schedule_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();