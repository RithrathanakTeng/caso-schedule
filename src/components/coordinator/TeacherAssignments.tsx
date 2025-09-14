import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Users, BookOpen, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface Teacher {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Subject {
  id: string;
  name: string;
  name_khmer?: string;
  code?: string;
  course?: {
    name: string;
  };
}

interface Assignment {
  id: string;
  teacher_id: string;
  subject_id: string;
  assignment_type: string;
  status: string;
  notes?: string;
  teacher?: Teacher;
  subject?: Subject;
}

export const TeacherAssignments = () => {
  const { profile } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  useEffect(() => {
    if (profile) {
      fetchData();
    }
  }, [profile]);

  const fetchData = async () => {
    try {
      // Fetch assignments with teacher and subject details
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('teacher_subject_assignments')
        .select(`
          *,
          subjects(
            id, name, name_khmer, code,
            courses(name)
          )
        `)
        .eq('institution_id', profile?.institution_id);

      if (assignmentsError) throw assignmentsError;

      // Get teacher user IDs first
      const { data: teacherRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'teacher')
        .eq('institution_id', profile?.institution_id);

      if (rolesError) throw rolesError;

      const teacherIds = teacherRoles?.map(r => r.user_id) || [];

      // Fetch teacher profiles
      const { data: teachersData, error: teachersError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .eq('institution_id', profile?.institution_id)
        .in('user_id', teacherIds);

      if (teachersError) throw teachersError;

      // Fetch all subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select(`
          id, name, name_khmer, code,
          courses(name)
        `)
        .eq('is_active', true);

      if (subjectsError) throw subjectsError;

      // Combine assignments with teacher data
      const enrichedAssignments = assignmentsData?.map(assignment => ({
        ...assignment,
        teacher: teachersData?.find(t => t.user_id === assignment.teacher_id)
      })) || [];

      setAssignments(enrichedAssignments);
      setTeachers(teachersData || []);
      setSubjects(subjectsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (assignmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('teacher_subject_assignments')
        .update({ status: newStatus })
        .eq('id', assignmentId);

      if (error) throw error;

      // Send notification to teacher
      const assignment = assignments.find(a => a.id === assignmentId);
      if (assignment) {
        await supabase
          .from('notifications')
          .insert({
            user_id: assignment.teacher_id,
            institution_id: profile?.institution_id,
            title: 'Subject Assignment Update',
            message: `Your subject preference for "${assignment.subject?.name}" has been ${newStatus}`,
            type: newStatus === 'approved' ? 'success' : 'warning'
          });
      }

      toast.success(`Assignment ${newStatus} successfully`);
      await fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update assignment status');
    }
  };

  const handleManualAssignment = async () => {
    if (!selectedTeacher || !selectedSubject || !profile) {
      toast.error('Please select both teacher and subject');
      return;
    }

    try {
      const { error } = await supabase
        .from('teacher_subject_assignments')
        .insert({
          teacher_id: selectedTeacher,
          subject_id: selectedSubject,
          assignment_type: 'assigned',
          status: 'approved',
          assigned_by: profile.user_id,
          assigned_at: new Date().toISOString(),
          notes: assignmentNotes,
          institution_id: profile.institution_id
        });

      if (error) throw error;

      // Send notification to teacher
      const teacher = teachers.find(t => t.user_id === selectedTeacher);
      const subject = subjects.find(s => s.id === selectedSubject);
      
      await supabase
        .from('notifications')
        .insert({
          user_id: selectedTeacher,
          institution_id: profile.institution_id,
          title: 'New Subject Assignment',
          message: `You have been assigned to teach "${subject?.name}"`,
          type: 'info'
        });

      toast.success('Teacher assigned successfully');
      setSelectedTeacher('');
      setSelectedSubject('');
      setAssignmentNotes('');
      await fetchData();
    } catch (error) {
      console.error('Error creating assignment:', error);
      toast.error('Failed to assign teacher');
    }
  };

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const approvedAssignments = assignments.filter(a => a.status === 'approved');

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
            <Users className="h-5 w-5" />
            Teacher Subject Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">
                Requests ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="assigned">
                Assigned ({approvedAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="manual">Manual Assignment</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Review teacher preferences for subject assignments
              </div>
              
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {assignment.teacher?.first_name} {assignment.teacher?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {assignment.teacher?.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{assignment.subject?.name}</span>
                            {assignment.subject?.code && (
                              <Badge variant="outline">{assignment.subject.code}</Badge>
                            )}
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {assignment.assignment_type === 'preference' ? 'Teacher Request' : 'Manual Assignment'}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(assignment.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(assignment.id, 'declined')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="assigned" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Currently approved teacher-subject assignments
              </div>
              
              {approvedAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No approved assignments yet
                </div>
              ) : (
                <div className="space-y-4">
                  {approvedAssignments.map((assignment) => (
                    <div key={assignment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="font-medium">
                            {assignment.teacher?.first_name} {assignment.teacher?.last_name}
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{assignment.subject?.name}</span>
                            {assignment.subject?.code && (
                              <Badge variant="outline">{assignment.subject.code}</Badge>
                            )}
                          </div>
                          {assignment.notes && (
                            <div className="text-sm text-muted-foreground">
                              <MessageSquare className="inline h-3 w-3 mr-1" />
                              {assignment.notes}
                            </div>
                          )}
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {assignment.assignment_type === 'assigned' ? 'Manually Assigned' : 'Approved Request'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <div className="text-sm text-muted-foreground mb-4">
                Manually assign teachers to subjects
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Teacher</label>
                  <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map((teacher) => (
                        <SelectItem key={teacher.user_id} value={teacher.user_id}>
                          {teacher.first_name} {teacher.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Select Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.course?.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="Add any notes for this assignment..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleManualAssignment}
                disabled={!selectedTeacher || !selectedSubject}
                className="w-full"
              >
                Assign Teacher to Subject
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};