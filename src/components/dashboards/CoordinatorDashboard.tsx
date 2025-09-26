import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import AddCourseDialog from '@/components/forms/AddCourseDialog';
import AddSubjectDialog from '@/components/forms/AddSubjectDialog';
import AddGradeLevelDialog from '@/components/forms/AddGradeLevelDialog';
import AvailabilityDialog from '@/components/forms/AvailabilityDialog';
import ScheduleDialog from '@/components/forms/ScheduleDialog';
import EditScheduleDialog from '@/components/forms/EditScheduleDialog';
import TeacherListView from '@/components/teacher/TeacherListView';
import { TeacherAssignments } from '@/components/coordinator/TeacherAssignments';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  Settings,
  LogOut,
  CalendarDays,
  Brain,
  AlertTriangle,
  Plus,
  CheckCircle,
  XCircle,
  Trash2,
  Download
} from 'lucide-react';
import ConflictDetectionSystem from '@/components/ConflictDetectionSystem';
import NotificationSystem from '@/components/NotificationSystem';
import GlobalNotificationBell from '@/components/GlobalNotificationBell';
import { exportToCSV, exportToJSON } from '@/utils/export';

const CoordinatorDashboard = () => {
  const { profile, institution, signOut } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTeachers: 0,
    availableTeachers: 0,
    totalCourses: 0,
    activeSchedules: 0
  });

  useEffect(() => {
    if (profile?.institution_id) {
      console.log('🔄 CoordinatorDashboard: Starting data fetch for institution:', profile.institution_id);
      fetchData();
    }
  }, [profile?.institution_id]);

  const fetchData = async () => {
    try {
      console.log('📊 CoordinatorDashboard: Fetching all data...');
      await Promise.all([
        fetchSchedules(),
        fetchCourses(),
        fetchConflicts(),
        fetchStats()
      ]);
      console.log('✅ CoordinatorDashboard: All data fetched successfully');
    } catch (error) {
      console.error('❌ CoordinatorDashboard: Error fetching data:', error);
    }
  };

  const fetchSchedules = async () => {
    try {
      console.log('📅 CoordinatorDashboard: Fetching schedules...');
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('institution_id', profile?.institution_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('❌ CoordinatorDashboard: Schedules error:', error);
        throw error;
      }
      
      console.log('✅ CoordinatorDashboard: Schedules fetched:', data?.length || 0);
      setSchedules(data || []);
    } catch (error) {
      console.error('❌ CoordinatorDashboard: Error fetching schedules:', error);
      setSchedules([]);
    }
  };

  const fetchCourses = async () => {
    try {
      console.log('📚 CoordinatorDashboard: Fetching courses/grade levels...');
      
      if (institution?.institution_type === 'high_school') {
        // Fetch grade levels for high school
        const { data, error } = await supabase
          .from('grade_levels')
          .select(`
            *,
            subjects (
              id,
              name,
              hours_per_week,
              subject_type,
              is_elective
            )
          `)
          .eq('institution_id', profile?.institution_id)
          .eq('is_active', true)
          .order('grade_number');

        if (error) {
          console.error('❌ CoordinatorDashboard: Grade levels error:', error);
          throw error;
        }
        
        console.log('✅ CoordinatorDashboard: Grade levels fetched:', data?.length || 0);
        setCourses(data || []);
      } else {
        // Fetch courses for university
        const { data, error } = await supabase
          .from('courses')
          .select(`
            *,
            subjects (
              id,
              name,
              hours_per_week,
              subject_type,
              is_elective
            )
          `)
          .eq('institution_id', profile?.institution_id)
          .eq('is_active', true);

        if (error) {
          console.error('❌ CoordinatorDashboard: Courses error:', error);
          throw error;
        }
        
        console.log('✅ CoordinatorDashboard: Courses fetched:', data?.length || 0);
        setCourses(data || []);
      }
    } catch (error) {
      console.error('❌ CoordinatorDashboard: Error fetching courses/grade levels:', error);
      setCourses([]);
    }
  };

  const fetchConflicts = async () => {
    try {
      console.log('⚠️ CoordinatorDashboard: Fetching conflicts...');
      const { data, error } = await supabase
        .from('schedule_conflicts')
        .select(`
          *,
          schedules (name)
        `)
        .eq('is_resolved', false)
        .limit(10);

      if (error) {
        console.error('❌ CoordinatorDashboard: Conflicts error:', error);
        throw error;
      }
      
      console.log('✅ CoordinatorDashboard: Conflicts fetched:', data?.length || 0);
      setConflicts(data || []);
    } catch (error) {
      console.error('❌ CoordinatorDashboard: Error fetching conflicts:', error);
      setConflicts([]);
    }
  };

  const fetchStats = async () => {
    try {
      console.log('📊 CoordinatorDashboard: Fetching statistics...');
      
      // Get teacher count
      const { data: teacherRoles, error: teacherError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('institution_id', profile?.institution_id)
        .eq('role', 'teacher');

      if (teacherError) {
        console.error('❌ CoordinatorDashboard: Teacher roles error:', teacherError);
      }

      // Get teachers with availability
      const { data: availableTeachers, error: availabilityError } = await supabase
        .from('teacher_availability')
        .select('teacher_id')
        .eq('institution_id', profile?.institution_id)
        .eq('is_available', true);

      if (availabilityError) {
        console.error('❌ CoordinatorDashboard: Availability error:', availabilityError);
      }

      // Get course count
      const { data: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .eq('institution_id', profile?.institution_id)
        .eq('is_active', true);

      if (coursesError) {
        console.error('❌ CoordinatorDashboard: Courses count error:', coursesError);
      }

      // Get active schedules
      const { data: activeSchedules, error: schedulesError } = await supabase
        .from('schedules')
        .select('id')
        .eq('institution_id', profile?.institution_id)
        .eq('status', 'published');

      if (schedulesError) {
        console.error('❌ CoordinatorDashboard: Active schedules error:', schedulesError);
      }

      const uniqueAvailableTeachers = [...new Set(availableTeachers?.map(t => t.teacher_id) || [])];

      const newStats = {
        totalTeachers: teacherRoles?.length || 0,
        availableTeachers: uniqueAvailableTeachers.length,
        totalCourses: coursesCount?.length || 0,
        activeSchedules: activeSchedules?.length || 0
      };

      console.log('📈 CoordinatorDashboard: Stats calculated:', newStats);
      setStats(newStats);
    } catch (error) {
      console.error('❌ CoordinatorDashboard: Error fetching stats:', error);
      // Set fallback stats
      setStats({
        totalTeachers: 0,
        availableTeachers: 0,
        totalCourses: 0,
        activeSchedules: 0
      });
    }
  };

  const resolveConflict = async (conflictId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_conflicts')
        .update({
          is_resolved: true,
          resolved_by: profile?.user_id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Conflict marked as resolved'
      });

      fetchConflicts();
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve conflict',
        variant: 'destructive'
      });
    }
  };

  const publishSchedule = async (scheduleId: string) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update({ status: 'published' })
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Schedule published successfully'
      });

      fetchSchedules();
    } catch (error) {
      console.error('Error publishing schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish schedule',
        variant: 'destructive'
      });
    }
  };

  const deleteCourse = async (courseId: string, courseName: string) => {
    if (!confirm(`Are you sure you want to delete "${courseName}"? This will also delete all subjects under this course.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from(institution?.institution_type === 'high_school' ? 'grade_levels' : 'courses')
        .update({ is_active: false })
        .eq('id', courseId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${institution?.institution_type === 'high_school' ? 'Grade level' : 'Course'} deleted successfully`
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: `Failed to delete ${institution?.institution_type === 'high_school' ? 'grade level' : 'course'}`,
        variant: 'destructive'
      });
    }
  };

  const deleteSubject = async (subjectId: string, subjectName: string) => {
    if (!confirm(`Are you sure you want to delete the subject "${subjectName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subjects')
        .update({ is_active: false })
        .eq('id', subjectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Subject deleted successfully'
      });

      fetchCourses();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subject',
        variant: 'destructive'
      });
    }
  };

  const deleteSchedule = async (scheduleId: string, scheduleName: string) => {
    if (!confirm(`Are you sure you want to delete schedule "${scheduleName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      // First delete schedule entries
      await supabase
        .from('schedule_entries')
        .delete()
        .eq('schedule_id', scheduleId);

      // Then delete the schedule
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: `Schedule "${scheduleName}" deleted successfully`
      });
      
      fetchSchedules(); // Refresh the list
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error", 
        description: "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const exportSchedule = async (scheduleId: string, scheduleName: string, format: 'csv' | 'json') => {
    try {
      // First fetch schedule entries
      const { data: scheduleEntries, error: entriesError } = await supabase
        .from('schedule_entries')
        .select(`
          *,
          subjects (name, code)
        `)
        .eq('schedule_id', scheduleId);

      if (entriesError) throw entriesError;

      if (!scheduleEntries || scheduleEntries.length === 0) {
        toast({
          title: "No Data",
          description: "This schedule has no entries to export",
          variant: "destructive"
        });
        return;
      }

      // Get unique teacher IDs
      const teacherIds = [...new Set(scheduleEntries.map(entry => entry.teacher_id))];
      
      // Fetch teacher profiles
      const { data: teachers, error: teachersError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email')
        .in('user_id', teacherIds);

      if (teachersError) throw teachersError;

      // Create teacher lookup map
      const teacherMap = new Map(teachers?.map(teacher => [teacher.user_id, teacher]) || []);

      // Transform data for export
      const exportData = scheduleEntries.map(entry => {
        const teacher = teacherMap.get(entry.teacher_id);
        return {
          day_of_week: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][entry.day_of_week],
          start_time: entry.start_time,
          end_time: entry.end_time,
          subject: entry.subjects?.name || 'Unknown Subject',
          subject_code: entry.subjects?.code || '',
          teacher_name: teacher ? `${teacher.first_name} ${teacher.last_name}` : 'Unknown Teacher',
          teacher_email: teacher?.email || '',
          room: entry.room || '',
          notes: entry.notes || ''
        };
      });

      const filename = `schedule_${scheduleName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'csv') {
        exportToCSV(exportData, filename);
      } else {
        exportToJSON(exportData, filename);
      }

      toast({
        title: "Success",
        description: `Schedule exported as ${format.toUpperCase()}`
      });

    } catch (error) {
      console.error('Error exporting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to export schedule",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold truncate">Coordinator Dashboard</h1>
                <p className="text-sm text-muted-foreground hidden sm:block truncate">{institution?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <GlobalNotificationBell />
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">Coordinator</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback className="text-xs">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:inline-flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="icon" onClick={signOut} className="sm:hidden">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                <span className="hidden sm:inline">Teachers</span>
                <span className="sm:hidden">Staff</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.availableTeachers}/{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Available/Total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-success" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-accent" />
                <span className="hidden sm:inline">Schedules</span>
                <span className="sm:hidden">Sched</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{stats.activeSchedules}</div>
              <p className="text-xs text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                <span className="hidden sm:inline">Conflicts</span>
                <span className="sm:hidden">Issues</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{conflicts.length}</div>
              <p className="text-xs text-muted-foreground">Unresolved</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="schedules" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Schedules</span>
              <span className="sm:hidden">Sched</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Teachers</span>
              <span className="sm:hidden">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Assignments</span>
              <span className="sm:hidden">Assign</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-xs sm:text-sm py-2 px-1 sm:px-3">Courses</TabsTrigger>
            <TabsTrigger value="conflicts" className="text-xs sm:text-sm py-2 px-1 sm:px-3">
              <span className="hidden sm:inline">Conflicts</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Schedules</CardTitle>
                  <CardDescription>Latest scheduling activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedules.length > 0 ? schedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{schedule.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={schedule.status === 'published' ? 'default' : 'secondary'}>
                              {schedule.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(schedule.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {schedule.generation_method === 'ai' ? 'AI Generated' : 'Manual'}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No schedules created yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Conflicts</CardTitle>
                  <CardDescription>Issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {conflicts.length > 0 ? conflicts.map((conflict) => (
                      <div key={conflict.id} className="flex items-center justify-between p-3 border rounded border-warning/20 bg-warning/5">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{conflict.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {conflict.schedules?.name} • {new Date(conflict.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => resolveConflict(conflict.id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                        <p className="text-muted-foreground">No conflicts detected</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedules">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Schedule Management</CardTitle>
                    <CardDescription>
                      Create, edit, and manage academic timetables
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <ScheduleDialog mode="ai" onScheduleCreated={fetchSchedules} />
                    <ScheduleDialog mode="manual" onScheduleCreated={fetchSchedules} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedules.length > 0 ? schedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 border rounded">
                      <div className="flex-1">
                        <h4 className="font-medium">{schedule.name}</h4>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>{new Date(schedule.week_start_date).toLocaleDateString()} - {new Date(schedule.week_end_date).toLocaleDateString()}</span>
                          <Badge variant={schedule.status === 'published' ? 'default' : 'secondary'}>
                            {schedule.status}
                          </Badge>
                          <span>{schedule.generation_method === 'ai' ? 'AI Generated' : 'Manual'}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:gap-0">
                        <EditScheduleDialog schedule={schedule} onScheduleUpdated={fetchSchedules} />
                        {schedule.status === 'draft' && (
                          <Button 
                            size="sm" 
                            className="w-full sm:w-auto"
                            onClick={() => publishSchedule(schedule.id)}
                          >
                            Publish
                          </Button>
                        )}
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportSchedule(schedule.id, schedule.name, 'csv')}
                            className="w-full sm:w-auto"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => exportSchedule(schedule.id, schedule.name, 'json')}
                            className="w-full sm:w-auto"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            JSON
                          </Button>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteSchedule(schedule.id, schedule.name)}
                          className="text-destructive hover:text-destructive w-full sm:w-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Schedules Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Create your first schedule using AI generation or manual setup
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Teacher Management</CardTitle>
                    <CardDescription>
                      View teacher availability and preferences
                    </CardDescription>
                  </div>
                  <AvailabilityDialog />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 sm:p-4 border rounded">
                    <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalTeachers}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Total Teachers</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 border rounded">
                    <div className="text-xl sm:text-2xl font-bold text-success">{stats.availableTeachers}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 border rounded">
                    <div className="text-xl sm:text-2xl font-bold text-muted-foreground">
                      {stats.totalTeachers - stats.availableTeachers}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
                  </div>
                </div>
                
                <TeacherListView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <TeacherAssignments />
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Course Management</CardTitle>
                    <CardDescription>
                      Manage courses, subjects, and academic requirements
                    </CardDescription>
                  </div>
                  <AddCourseDialog onCourseAdded={fetchCourses} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.length > 0 ? courses.map((course) => (
                    <div key={course.id} className="border rounded p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{course.name}</h4>
                          {course.name_khmer && (
                            <p className="text-sm text-muted-foreground">{course.name_khmer}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            {course.code && (
                              <Badge variant="outline">{course.code}</Badge>
                            )}
                            <span className="text-sm text-muted-foreground">
                              {course.hours_per_week} hours/week
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AddSubjectDialog 
                            onSubjectAdded={fetchCourses}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteCourse(course.id, course.name)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {course.subjects && course.subjects.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Subjects:</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {course.subjects.map((subject: any) => (
                              <div key={subject.id} className="p-2 bg-muted rounded text-sm flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium">{subject.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {subject.hours_per_week}h/week
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSubject(subject.id, subject.name)}
                                  className="text-destructive hover:text-destructive p-1 h-auto"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Courses Yet</h3>
                      <p className="text-muted-foreground mb-6">
                        Add your first course to start building your curriculum
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts">
            <div className="space-y-6">
              {/* AI-Powered Conflict Detection */}
              <ConflictDetectionSystem />
              
              {/* Notification System for Coordinators */}
              <NotificationSystem showCreateForm={true} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;