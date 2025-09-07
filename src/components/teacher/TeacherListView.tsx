import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Clock, Mail, Phone, CheckCircle, XCircle, Calendar } from 'lucide-react';

interface Teacher {
  user_id: string;
  first_name: string;
  last_name: string;
  first_name_khmer?: string;
  last_name_khmer?: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  is_active: boolean;
  availability_count: number;
  total_hours: number;
}

const TeacherListView = () => {
  const { profile } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.institution_id) {
      fetchTeachers();
    }
  }, [profile?.institution_id]);

  const fetchTeachers = async () => {
    try {
      // Get all teachers in the institution
      const { data: teacherRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('institution_id', profile?.institution_id)
        .eq('role', 'teacher');

      if (rolesError) throw rolesError;

      if (!teacherRoles || teacherRoles.length === 0) {
        setTeachers([]);
        setLoading(false);
        return;
      }

      const teacherIds = teacherRoles.map(r => r.user_id);

      // Get teacher profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', teacherIds);

      if (profilesError) throw profilesError;

      // Get availability data for each teacher
      const teachersWithAvailability = await Promise.all(
        (profiles || []).map(async (teacher) => {
          const { data: availability } = await supabase
            .from('teacher_availability')
            .select('*')
            .eq('teacher_id', teacher.user_id)
            .eq('is_available', true);

          const totalHours = availability?.reduce((sum, slot) => {
            const start = new Date(`1970-01-01T${slot.start_time}`);
            const end = new Date(`1970-01-01T${slot.end_time}`);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) || 0;

          return {
            ...teacher,
            availability_count: availability?.length || 0,
            total_hours: Math.round(totalHours * 10) / 10
          };
        })
      );

      setTeachers(teachersWithAvailability);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch teachers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTeacherStatus = async (teacherId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('user_id', teacherId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Teacher ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchTeachers();
    } catch (error) {
      console.error('Error updating teacher status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update teacher status',
        variant: 'destructive'
      });
    }
  };

  const getDayName = (dayNum: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNum] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Teachers Found</h3>
        <p className="text-muted-foreground mb-6">
          Add teachers to your institution to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => (
        <Card key={teacher.user_id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={teacher.avatar_url} />
                <AvatarFallback>
                  {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold truncate">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  {teacher.is_active ? (
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                  )}
                </div>
                {teacher.first_name_khmer && teacher.last_name_khmer && (
                  <p className="text-sm text-muted-foreground truncate">
                    {teacher.first_name_khmer} {teacher.last_name_khmer}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{teacher.email}</span>
            </div>
            
            {teacher.phone && (
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.phone}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{teacher.availability_count} time slots</span>
              </div>
              <Badge variant={teacher.total_hours > 0 ? 'default' : 'secondary'}>
                {teacher.total_hours}h/week
              </Badge>
            </div>

            <div className="pt-2">
              <Button
                variant={teacher.is_active ? 'outline' : 'default'}
                size="sm"
                className="w-full"
                onClick={() => toggleTeacherStatus(teacher.user_id, teacher.is_active)}
              >
                {teacher.is_active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TeacherListView;