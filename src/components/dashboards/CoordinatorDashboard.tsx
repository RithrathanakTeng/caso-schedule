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
import AvailabilityDialog from '@/components/forms/AvailabilityDialog';
import ScheduleDialog from '@/components/forms/ScheduleDialog';
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
  XCircle
} from 'lucide-react';

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
      fetchData();
    }
  }, [profile?.institution_id]);

  const fetchData = async () => {
    await Promise.all([
      fetchSchedules(),
      fetchCourses(),
      fetchConflicts(),
      fetchStats()
    ]);
  };

  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .eq('institution_id', profile?.institution_id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSchedules(data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          subjects (
            id,
            name,
            hours_per_week
          )
        `)
        .eq('institution_id', profile?.institution_id)
        .eq('is_active', true);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchConflicts = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_conflicts')
        .select(`
          *,
          schedules (name)
        `)
        .eq('is_resolved', false)
        .limit(10);

      if (error) throw error;
      setConflicts(data || []);
    } catch (error) {
      console.error('Error fetching conflicts:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Get teacher count
      const { data: teacherRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('institution_id', profile?.institution_id)
        .eq('role', 'teacher');

      // Get teachers with availability
      const { data: availableTeachers } = await supabase
        .from('teacher_availability')
        .select('teacher_id')
        .eq('institution_id', profile?.institution_id)
        .eq('is_available', true);

      // Get course count
      const { data: coursesCount } = await supabase
        .from('courses')
        .select('id')
        .eq('institution_id', profile?.institution_id)
        .eq('is_active', true);

      // Get active schedules
      const { data: activeSchedules } = await supabase
        .from('schedules')
        .select('id')
        .eq('institution_id', profile?.institution_id)
        .eq('status', 'published');

      const uniqueAvailableTeachers = [...new Set(availableTeachers?.map(t => t.teacher_id) || [])];

      setStats({
        totalTeachers: teacherRoles?.length || 0,
        availableTeachers: uniqueAvailableTeachers.length,
        totalCourses: coursesCount?.length || 0,
        activeSchedules: activeSchedules?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Settings className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Coordinator Dashboard</h1>
                <p className="text-sm text-muted-foreground">{institution?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">Coordinator</p>
              </div>
              <Avatar>
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-primary" />
                Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.availableTeachers}/{stats.totalTeachers}</div>
              <p className="text-xs text-muted-foreground">Available/Total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-success" />
                Courses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">Active courses</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-accent" />
                Schedules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSchedules}</div>
              <p className="text-xs text-muted-foreground">Published schedules</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-warning" />
                Conflicts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conflicts.length}</div>
              <p className="text-xs text-muted-foreground">Unresolved conflicts</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div className="flex space-x-2">
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
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        {schedule.status === 'draft' && (
                          <Button size="sm">Publish</Button>
                        )}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-primary">{stats.totalTeachers}</div>
                    <div className="text-sm text-muted-foreground">Total Teachers</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-success">{stats.availableTeachers}</div>
                    <div className="text-sm text-muted-foreground">Available Teachers</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {stats.totalTeachers - stats.availableTeachers}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending Availability</div>
                  </div>
                </div>
                
                {stats.totalTeachers === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Teachers Found</h3>
                    <p className="text-muted-foreground mb-6">
                      Add teachers to your institution to manage their availability
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Use the "Collect Availability" button to manage teacher schedules
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
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
                        <Button variant="outline" size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Subject
                        </Button>
                      </div>
                      
                      {course.subjects && course.subjects.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">Subjects:</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {course.subjects.map((subject: any) => (
                              <div key={subject.id} className="p-2 bg-muted rounded text-sm">
                                <div className="font-medium">{subject.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {subject.hours_per_week}h/week
                                </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;