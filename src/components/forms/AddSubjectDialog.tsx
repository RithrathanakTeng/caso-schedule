import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  name: string;
  code: string;
}

interface GradeLevel {
  id: string;
  grade_number: number;
  name: string;
  name_khmer?: string;
}

interface AddSubjectDialogProps {
  onSubjectAdded?: () => void;
}

const AddSubjectDialog = ({ onSubjectAdded }: AddSubjectDialogProps) => {
  const { profile, institution } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_khmer: '',
    code: '',
    course_id: '',
    grade_level_id: '',
    hours_per_week: 1,
    is_elective: false,
    subject_type: 'core'
  });

  const isHighSchool = institution?.institution_type === 'high_school';

  const fetchData = async () => {
    if (!profile?.institution_id) return;

    try {
      if (isHighSchool) {
        // Fetch grade levels for high school
        const { data: gradeLevelsData, error: gradeLevelsError } = await supabase
          .from('grade_levels')
          .select('*')
          .eq('institution_id', profile.institution_id)
          .eq('is_active', true)
          .order('grade_number');

        if (gradeLevelsError) throw gradeLevelsError;
        setGradeLevels(gradeLevelsData || []);
      } else {
        // Fetch courses for university
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, name, code')
          .eq('institution_id', profile.institution_id)
          .eq('is_active', true)
          .order('name');

        if (coursesError) throw coursesError;
        setCourses(coursesData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, profile?.institution_id, isHighSchool]);

  const handleSubmit = async () => {
    if (!profile?.institution_id) return;
    
    // Validate required fields
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    // Ensure either course_id or grade_level_id is selected
    if (!formData.course_id && !formData.grade_level_id) {
      toast({
        title: "Error",
        description: `Please select ${isHighSchool ? 'a grade level' : 'a course'}`,
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const subjectData = {
        institution_id: profile.institution_id,
        name: formData.name.trim(),
        name_khmer: formData.name_khmer.trim() || null,
        code: formData.code.trim() || null,
        course_id: formData.course_id || null,
        grade_level_id: formData.grade_level_id || null,
        hours_per_week: formData.hours_per_week,
        is_elective: formData.is_elective,
        subject_type: formData.subject_type
      };

      const { error } = await supabase
        .from('subjects')
        .insert(subjectData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Subject created successfully"
      });

      // Reset form
      setFormData({
        name: '',
        name_khmer: '',
        code: '',
        course_id: '',
        grade_level_id: '',
        hours_per_week: 1,
        is_elective: false,
        subject_type: 'core'
      });
      setOpen(false);
      onSubjectAdded?.();
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Create a new subject for {isHighSchool ? 'a grade level' : 'a course'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder={isHighSchool ? "e.g., Mathematics, Science" : "e.g., Database Systems, Calculus"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_khmer">Subject Name (Khmer)</Label>
            <Input
              id="name_khmer"
              value={formData.name_khmer}
              onChange={(e) => setFormData({...formData, name_khmer: e.target.value})}
              placeholder="ឈ្មោះមុខវិជ្ជាជាភាសាខ្មែរ"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Subject Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
              placeholder={isHighSchool ? "e.g., MATH10, SCI11" : "e.g., CS101, MATH201"}
            />
          </div>
          
          {/* Course/Grade Level Selection */}
          {isHighSchool ? (
            <div className="space-y-2">
              <Label htmlFor="grade_level_id">Grade Level *</Label>
              <Select 
                value={formData.grade_level_id} 
                onValueChange={(value) => setFormData({...formData, grade_level_id: value, course_id: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  {gradeLevels.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name} {grade.name_khmer && `(${grade.name_khmer})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="course_id">Course *</Label>
              <Select 
                value={formData.course_id} 
                onValueChange={(value) => setFormData({...formData, course_id: value, grade_level_id: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} {course.code && `(${course.code})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours_per_week">Hours per Week</Label>
              <Input
                id="hours_per_week"
                type="number"
                min="1"
                max="20"
                value={formData.hours_per_week}
                onChange={(e) => setFormData({...formData, hours_per_week: parseInt(e.target.value) || 1})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject_type">Subject Type</Label>
              <Select value={formData.subject_type} onValueChange={(value) => setFormData({...formData, subject_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="elective">Elective</SelectItem>
                  <SelectItem value="specialized">Specialized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_elective"
              checked={formData.is_elective}
              onCheckedChange={(checked) => setFormData({...formData, is_elective: checked})}
            />
            <Label htmlFor="is_elective">Optional/Elective Subject</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Subject
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;