import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, Clock, User, BookOpen } from 'lucide-react';

interface EditScheduleDialogProps {
  schedule: any;
  onScheduleUpdated: () => void;
}

interface ScheduleEntry {
  id: string;
  subject_id: string;
  teacher_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  schedule_id?: string;
  subjects?: { name: string } | null;
  profiles?: { first_name: string; last_name: string } | null;
}

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
];

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const EditScheduleDialog: React.FC<EditScheduleDialogProps> = ({ schedule, onScheduleUpdated }) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scheduleName, setScheduleName] = useState(schedule.name);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch schedule entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('schedule_entries')
        .select(`
          id,
          subject_id,
          teacher_id,
          day_of_week,
          start_time,
          end_time,
          room,
          notes,
          created_at,
          updated_at,
          schedule_id,
          subjects!inner (name)
        `)
        .eq('schedule_id', schedule.id);

      if (entriesError) throw entriesError;

      // Get teacher profiles separately
      const teacherIds = [...new Set(entriesData?.map(entry => entry.teacher_id) || [])];
      const { data: teacherProfiles, error: teacherError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', teacherIds);

      if (teacherError) throw teacherError;

      // Enrich entries with teacher data
      const enrichedEntries = entriesData?.map(entry => ({
        ...entry,
        teacher: teacherProfiles?.find(t => t.user_id === entry.teacher_id)
      })) || [];

      setEntries((enrichedEntries as unknown as ScheduleEntry[]) || []);

      // Fetch subjects
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('institution_id', profile?.institution_id)
        .eq('is_active', true);

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

      // Fetch teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (role)
        `)
        .eq('institution_id', profile?.institution_id)
        .eq('user_roles.role', 'teacher')
        .eq('is_active', true);

      if (teachersError) throw teachersError;
      setTeachers(teachersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load schedule data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setLoading(true);

      // Update schedule name
      const { error: scheduleError } = await supabase
        .from('schedules')
        .update({ name: scheduleName })
        .eq('id', schedule.id);

      if (scheduleError) throw scheduleError;

      toast({
        title: 'Success',
        description: 'Schedule updated successfully'
      });

      onScheduleUpdated();
      setOpen(false);
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('schedule_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      setEntries(entries.filter(e => e.id !== entryId));
      toast({
        title: 'Success',
        description: 'Schedule entry deleted'
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive'
      });
    }
  };

  const handleAddEntry = async (newEntry: Partial<ScheduleEntry>) => {
    try {
      const { data, error } = await supabase
        .from('schedule_entries')
        .insert({
          schedule_id: schedule.id,
          subject_id: newEntry.subject_id,
          teacher_id: newEntry.teacher_id,
          day_of_week: newEntry.day_of_week,
          start_time: newEntry.start_time,
          end_time: newEntry.end_time,
          room: newEntry.room,
          notes: newEntry.notes
        })
        .select(`
          id,
          subject_id,
          teacher_id,
          day_of_week,
          start_time,
          end_time,
          room,
          notes,
          subjects!inner (name),
          profiles!inner (first_name, last_name)
        `)
        .single();

      if (error) throw error;

      setEntries([...entries, data as unknown as ScheduleEntry]);
      toast({
        title: 'Success',
        description: 'Schedule entry added'
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to add entry',
        variant: 'destructive'
      });
    }
  };

  const groupedEntries = entries.reduce((acc, entry) => {
    const day = entry.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(entry);
    return acc;
  }, {} as Record<number, ScheduleEntry[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
          <DialogDescription>
            Modify schedule entries and settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Schedule Name */}
          <div className="space-y-2">
            <Label htmlFor="scheduleName">Schedule Name</Label>
            <Input
              id="scheduleName"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="Enter schedule name"
            />
          </div>

          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DAYS.map((day) => (
                  <Card key={day.value}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{day.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {groupedEntries[day.value]?.map((entry) => (
                          <div key={entry.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {entry.subjects?.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  {entry.start_time} - {entry.end_time}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  <User className="inline h-3 w-3 mr-1" />
                                  {entry.profiles?.first_name} {entry.profiles?.last_name}
                                </div>
                                {entry.room && (
                                  <Badge variant="outline" className="text-xs">
                                    {entry.room}
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        )) || (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No classes scheduled
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <div className="space-y-2">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                      <div>
                        <span className="font-medium">
                          {DAYS.find(d => d.value === entry.day_of_week)?.label}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm">
                          {entry.start_time} - {entry.end_time}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm">{entry.subjects?.name}</span>
                      </div>
                      <div>
                        <span className="text-sm">
                          {entry.profiles?.first_name} {entry.profiles?.last_name}
                        </span>
                      </div>
                      <div>
                        {entry.room && (
                          <Badge variant="outline">{entry.room}</Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Quick Add Entry */}
          <AddEntryForm
            subjects={subjects}
            teachers={teachers}
            onAddEntry={handleAddEntry}
          />

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface AddEntryFormProps {
  subjects: any[];
  teachers: any[];
  onAddEntry: (entry: Partial<ScheduleEntry>) => void;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ subjects, teachers, onAddEntry }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    teacher_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject_id || !formData.teacher_id || !formData.day_of_week || !formData.start_time || !formData.end_time) {
      return;
    }

    onAddEntry({
      ...formData,
      day_of_week: parseInt(formData.day_of_week)
    });

    setFormData({
      subject_id: '',
      teacher_id: '',
      day_of_week: '',
      start_time: '',
      end_time: '',
      room: '',
      notes: ''
    });
    setShowForm(false);
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Schedule Entry
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Schedule Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={formData.subject_id} onValueChange={(value) => setFormData({...formData, subject_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={formData.teacher_id} onValueChange={(value) => setFormData({...formData, teacher_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
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

            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={formData.day_of_week} onValueChange={(value) => setFormData({...formData, day_of_week: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room</Label>
              <Input
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                placeholder="Room number/name"
              />
            </div>

            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select value={formData.start_time} onValueChange={(value) => setFormData({...formData, start_time: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>End Time</Label>
              <Select value={formData.end_time} onValueChange={(value) => setFormData({...formData, end_time: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Entry</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditScheduleDialog;