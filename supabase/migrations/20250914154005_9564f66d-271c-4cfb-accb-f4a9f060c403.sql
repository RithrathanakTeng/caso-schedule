-- Fix foreign key constraints for teacher_subject_assignments table
ALTER TABLE public.teacher_subject_assignments 
ADD CONSTRAINT teacher_subject_assignments_teacher_id_fkey 
FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teacher_subject_assignments_teacher_id 
ON public.teacher_subject_assignments(teacher_id);

CREATE INDEX IF NOT EXISTS idx_teacher_subject_assignments_institution_id 
ON public.teacher_subject_assignments(institution_id);

CREATE INDEX IF NOT EXISTS idx_teacher_subject_assignments_status 
ON public.teacher_subject_assignments(status);