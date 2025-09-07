import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Bell,
  LogOut,
  CalendarDays,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import TeacherScheduleView from '@/components/teacher/TeacherScheduleView';
import TeacherAvailability from '@/components/teacher/TeacherAvailability';
import TeacherNotifications from '@/components/teacher/TeacherNotifications';
import TeacherProfile from '@/components/teacher/TeacherProfile';
import NotificationSystem from '@/components/NotificationSystem';

const TeacherDashboard = () => {
  const { user, profile, institution, signOut } = useAuth();
  const [stats, setStats] = useState({
    weeklyClasses: 0,
    availabilityUpdated: false,
    notifications: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user || !profile?.institution_id) return;

      try {
        // Get weekly classes count
        const { data: scheduleEntries, error: scheduleError } = await supabase
          .from('schedule_entries')
          .select('id')
          .eq('teacher_id', user.id);

        if (scheduleError) throw scheduleError;

        // Get availability status
        const { data: availability, error: availabilityError } = await supabase
          .from('teacher_availability')
          .select('id')
          .eq('teacher_id', user.id)
          .limit(1);

        if (availabilityError) throw availabilityError;

        setStats({
          weeklyClasses: scheduleEntries?.length || 0,
          availabilityUpdated: availability && availability.length > 0,
          notifications: 2 // Mock notifications count
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [user, profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">Teacher Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{institution?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                  {profile?.first_name_khmer && profile?.last_name_khmer && (
                    <span className="block text-xs text-muted-foreground">
                      {profile.first_name_khmer} {profile.last_name_khmer}
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Teacher</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="sm:hidden p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Availability Status</CardTitle>
              {stats.availabilityUpdated ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertCircle className="h-4 w-4 text-warning" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.availabilityUpdated ? 'text-success' : 'text-warning'}`}>
                {stats.availabilityUpdated ? 'Updated' : 'Pending'}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.availabilityUpdated ? 'Availability set' : 'Please set your availability'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.weeklyClasses}</div>
              <p className="text-xs text-muted-foreground">
                {stats.weeklyClasses > 0 ? 'Classes assigned' : 'No classes scheduled'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notifications</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notifications}</div>
              <p className="text-xs text-muted-foreground">Recent updates</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="schedule" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="schedule" className="text-xs sm:text-sm">Schedule</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs sm:text-sm">Availability</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs sm:text-sm">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <TeacherScheduleView />
          </TabsContent>

          <TabsContent value="availability">
            <TeacherAvailability />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem />
          </TabsContent>

          <TabsContent value="profile">
            <TeacherProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherDashboard;