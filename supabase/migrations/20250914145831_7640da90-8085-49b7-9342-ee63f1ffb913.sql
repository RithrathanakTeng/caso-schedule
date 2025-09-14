-- Create teacher subject assignments table
CREATE TABLE public.teacher_subject_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  assignment_type TEXT NOT NULL DEFAULT 'preference', -- 'preference' or 'assigned'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'declined'
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  institution_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(teacher_id, subject_id)
);

-- Enable RLS
ALTER TABLE public.teacher_subject_assignments ENABLE ROW LEVEL SECURITY;

-- Teachers can view and manage their own assignments/preferences
CREATE POLICY "Teachers can view their own assignments" 
ON public.teacher_subject_assignments 
FOR SELECT 
USING (teacher_id = auth.uid() AND institution_id = get_user_institution_id(auth.uid()));

CREATE POLICY "Teachers can create their own preferences" 
ON public.teacher_subject_assignments 
FOR INSERT 
WITH CHECK (teacher_id = auth.uid() AND institution_id = get_user_institution_id(auth.uid()) AND assignment_type = 'preference');

CREATE POLICY "Teachers can update their own preferences" 
ON public.teacher_subject_assignments 
FOR UPDATE 
USING (teacher_id = auth.uid() AND institution_id = get_user_institution_id(auth.uid()) AND assignment_type = 'preference');

-- Coordinators and admins can manage all assignments
CREATE POLICY "Coordinators and admins can manage assignments" 
ON public.teacher_subject_assignments 
FOR ALL 
USING (institution_id = get_user_institution_id(auth.uid()) AND (has_role(auth.uid(), institution_id, 'coordinator'::user_role) OR has_role(auth.uid(), institution_id, 'admin'::user_role)));

-- Add trigger for updated_at
CREATE TRIGGER update_teacher_subject_assignments_updated_at
BEFORE UPDATE ON public.teacher_subject_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();