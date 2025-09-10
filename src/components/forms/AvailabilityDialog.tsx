import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Clock, Trash2 } from 'lucide-react';

interface TeacherProfile {
  id: string;
  first_name: string;
  last_name: string;
  user_id: string;
}

interface AvailabilityEntry {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes: string;
}

const AvailabilityDialog: React.FC = () => {
  const { profile, hasRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<AvailabilityEntry[]>([]);

  const isCoordinator = hasRole('coordinator') || hasRole('admin');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    if (open && isCoordinator) {
      fetchTeachers();
    }
  }, [open, isCoordinator]);

  const fetchTeachers = async () => {
    if (!profile?.institution_id) return;

    try {
      // Get teacher user IDs from user_roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('institution_id', profile.institution_id)
        .eq('role', 'teacher');

      if (rolesError) throw rolesError;

      if (roles && roles.length > 0) {
        const teacherIds = roles.map(role => role.user_id);
        
        // Get teacher profiles
        const { data: teacherProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, first_name, last_name')
          .in('user_id', teacherIds);

        if (profilesError) throw profilesError;
        
        setTeachers(teacherProfiles || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teachers',
        variant: 'destructive'
      });
    }
  };

  const fetchAvailability = async (teacherId: string) => {
    try {
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', teacherId)
        .eq('institution_id', profile?.institution_id);

      if (error) throw error;
      
      setAvailabilities(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const addAvailabilitySlot = () => {
    setAvailabilities(prev => [...prev, {
      day_of_week: 1,
      start_time: '09:00',
      end_time: '17:00',
      is_available: true,
      notes: ''
    }]);
  };

  const updateAvailability = (index: number, field: string, value: any) => {
    setAvailabilities(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeAvailability = (index: number) => {
    setAvailabilities(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const targetTeacherId = isCoordinator ? selectedTeacher : profile?.user_id;
    if (!targetTeacherId || !profile?.institution_id) return;

    setLoading(true);
    try {
      // Delete existing availability
      await supabase
        .from('teacher_availability')
        .delete()
        .eq('teacher_id', targetTeacherId)
        .eq('institution_id', profile.institution_id);

      // Insert new availability
      if (availabilities.length > 0) {
        const { error } = await supabase
          .from('teacher_availability')
          .insert(availabilities.map(item => ({
            ...item,
            teacher_id: targetTeacherId,
            institution_id: profile.institution_id
          })));

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Availability updated successfully'
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to update availability',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacher(teacherId);
    fetchAvailability(teacherId);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Clock className="h-4 w-4 mr-2" />
          {isCoordinator ? 'Collect Availability' : 'Set My Availability'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCoordinator ? 'Teacher Availability' : 'My Availability'}
          </DialogTitle>
          <DialogDescription>
            {isCoordinator 
              ? 'Manage teacher availability for scheduling'
              : 'Set your available time slots for teaching'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {isCoordinator && (
            <div>
              <Label htmlFor="teacher">Select Teacher</Label>
              <Select value={selectedTeacher} onValueChange={handleTeacherSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a teacher" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-background border shadow-lg">
                  {teachers.length > 0 ? teachers.map(teacher => (
                    <SelectItem key={teacher.user_id} value={teacher.user_id}>
                      {teacher.first_name} {teacher.last_name}
                    </SelectItem>
                  )) : (
                    <SelectItem value="" disabled>
                      No teachers found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {(selectedTeacher || !isCoordinator) && (
            <>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Time Slots</h3>
                <Button onClick={addAvailabilitySlot} variant="outline" size="sm">
                  Add Slot
                </Button>
              </div>

              <div className="space-y-3">
                {availabilities.map((availability, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded">
                    <Select 
                      value={availability.day_of_week.toString()} 
                      onValueChange={(value) => updateAvailability(index, 'day_of_week', parseInt(value))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day, dayIndex) => (
                          <SelectItem key={dayIndex} value={dayIndex.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="time"
                      value={availability.start_time}
                      onChange={(e) => updateAvailability(index, 'start_time', e.target.value)}
                      className="w-24"
                    />
                    
                    <span>to</span>
                    
                    <Input
                      type="time"
                      value={availability.end_time}
                      onChange={(e) => updateAvailability(index, 'end_time', e.target.value)}
                      className="w-24"
                    />
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={availability.is_available}
                        onCheckedChange={(checked) => updateAvailability(index, 'is_available', checked)}
                      />
                      <Label>Available</Label>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeAvailability(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Availability'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityDialog;