import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, BookOpen, School } from 'lucide-react';

interface Subject {
  id: string;
  name: string;
  name_khmer?: string;
  code?: string;
  hours_per_week: number;
  course_id: string;
  course?: {
    name: string;
    name_khmer?: string;
  };
  grade_level?: {
    grade_number: number;
    name: string;
  };
}

interface Assignment {
  id: string;
  subject_id: string;
  assignment_type: string;
  status: string;
  assigned_by?: string;
  notes?: string;
}

export const TeacherSubjectPreferences = () => {
  const { user, profile } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && profile) {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    try {
      // Fetch subjects with course/grade level info
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select(`
          id, name, name_khmer, code, hours_per_week, course_id,
          courses!inner(name, name_khmer),
          grade_levels(grade_number, name)
        `)
        .eq('is_active', true);

      if (subjectsError) throw subjectsError;

      // Fetch current assignments/preferences
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('teacher_subject_assignments')
        .select('*')
        .eq('teacher_id', user?.id);

      if (assignmentsError) throw assignmentsError;

      setSubjects(subjectsData || []);
      setAssignments(assignmentsData || []);
      
      // Set currently selected subjects
      const currentSelections = new Set(
        assignmentsData?.map(a => a.subject_id) || []
      );
      setSelectedSubjects(currentSelections);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectId: string) => {
    const newSelected = new Set(selectedSubjects);
    if (newSelected.has(subjectId)) {
      newSelected.delete(subjectId);
    } else {
      newSelected.add(subjectId);
    }
    setSelectedSubjects(newSelected);
  };

  const savePreferences = async () => {
    if (!user || !profile) return;
    
    setSaving(true);
    try {
      // Get current assignments
      const currentAssignmentIds = new Set(assignments.map(a => a.subject_id));
      
      // Subjects to add
      const toAdd = Array.from(selectedSubjects).filter(id => !currentAssignmentIds.has(id));
      
      // Subjects to remove (only preferences, not coordinator assignments)
      const toRemove = assignments
        .filter(a => a.assignment_type === 'preference' && !selectedSubjects.has(a.subject_id))
        .map(a => a.id);

      // Insert new preferences
      if (toAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('teacher_subject_assignments')
          .insert(
            toAdd.map(subjectId => ({
              teacher_id: user.id,
              subject_id: subjectId,
              assignment_type: 'preference',
              status: 'pending',
              institution_id: profile.institution_id
            }))
          );

        if (insertError) throw insertError;
      }

      // Remove unselected preferences
      if (toRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('teacher_subject_assignments')
          .delete()
          .in('id', toRemove);

        if (deleteError) throw deleteError;
      }

      toast.success('Subject preferences saved successfully');
      await fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const getAssignmentStatus = (subjectId: string) => {
    const assignment = assignments.find(a => a.subject_id === subjectId);
    return assignment;
  };

  const getStatusBadge = (assignment?: Assignment) => {
    if (!assignment) return null;
    
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800'
    };

    const typeColors = {
      preference: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800'
    };

    return (
      <div className="flex gap-1">
        <Badge className={typeColors[assignment.assignment_type as keyof typeof typeColors]}>
          {assignment.assignment_type === 'assigned' ? 'Assigned' : 'Preference'}
        </Badge>
        <Badge className={statusColors[assignment.status as keyof typeof statusColors]}>
          {assignment.status}
        </Badge>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Teaching Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Select the subjects you would like to teach. Coordinators will review your preferences.
          </p>
          
          <div className="space-y-4">
            {subjects.map((subject) => {
              const assignment = getAssignmentStatus(subject.id);
              const isDisabled = assignment?.assignment_type === 'assigned';
              
              return (
                <div key={subject.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={subject.id}
                    checked={selectedSubjects.has(subject.id)}
                    onCheckedChange={() => handleSubjectToggle(subject.id)}
                    disabled={isDisabled}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <label htmlFor={subject.id} className="font-medium cursor-pointer">
                        {subject.name}
                        {subject.name_khmer && (
                          <span className="text-muted-foreground ml-2">({subject.name_khmer})</span>
                        )}
                      </label>
                      {subject.code && (
                        <Badge variant="outline">{subject.code}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <School className="inline h-3 w-3 mr-1" />
                      {subject.course?.name} • {subject.hours_per_week} hours/week
                      {subject.grade_level && (
                        <span> • Grade {subject.grade_level.grade_number}</span>
                      )}
                    </div>
                    {assignment?.notes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Note: {assignment.notes}
                      </div>
                    )}
                  </div>
                  {getStatusBadge(assignment)}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <Button 
              onClick={savePreferences} 
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Preferences'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};