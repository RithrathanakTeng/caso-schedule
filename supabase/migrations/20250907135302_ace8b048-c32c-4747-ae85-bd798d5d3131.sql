-- Add institution type to distinguish between high school and university
ALTER TABLE institutions 
ADD COLUMN institution_type TEXT CHECK (institution_type IN ('high_school', 'university')) DEFAULT 'university';

-- Create grade levels table for high schools
CREATE TABLE grade_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  grade_number INTEGER NOT NULL, -- 9, 10, 11, 12 for high school
  name TEXT NOT NULL, -- "Grade 9", "Form 1", etc.
  name_khmer TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(institution_id, grade_number)
);

-- Enable RLS for grade_levels
ALTER TABLE grade_levels ENABLE ROW LEVEL SECURITY;

-- Create policies for grade_levels
CREATE POLICY "Users can view grade levels in their institution" 
ON grade_levels 
FOR SELECT 
USING (institution_id = get_user_institution_id(auth.uid()));

CREATE POLICY "Coordinators and admins can manage grade levels" 
ON grade_levels 
FOR ALL 
USING (
  institution_id = get_user_institution_id(auth.uid()) AND 
  (has_role(auth.uid(), institution_id, 'coordinator'::user_role) OR 
   has_role(auth.uid(), institution_id, 'admin'::user_role))
);

-- Modify subjects table to support both university and high school models
ALTER TABLE subjects 
ADD COLUMN grade_level_id UUID REFERENCES grade_levels(id) ON DELETE SET NULL,
ADD COLUMN is_elective BOOLEAN DEFAULT false,
ADD COLUMN subject_type TEXT CHECK (subject_type IN ('core', 'elective', 'specialized')) DEFAULT 'core';

-- Update subjects table constraint to allow either course_id OR grade_level_id (but not both)
ALTER TABLE subjects 
DROP CONSTRAINT IF EXISTS subjects_course_id_fkey,
ADD CONSTRAINT subjects_course_id_fkey FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;

-- Add constraint to ensure subjects have either course_id (university) or grade_level_id (high school)
ALTER TABLE subjects 
ADD CONSTRAINT subjects_parent_check CHECK (
  (course_id IS NOT NULL AND grade_level_id IS NULL) OR 
  (course_id IS NULL AND grade_level_id IS NOT NULL)
);

-- Create trigger for updated_at on grade_levels
CREATE TRIGGER update_grade_levels_updated_at
  BEFORE UPDATE ON grade_levels
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default grade levels for high schools (can be customized per institution)
-- This is just an example - institutions can create their own grade structure