-- Enable realtime for subject assignments
ALTER TABLE public.teacher_subject_assignments REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.teacher_subject_assignments;

-- Enable realtime for subjects table as well
ALTER TABLE public.subjects REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subjects;