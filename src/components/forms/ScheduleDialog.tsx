import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Brain, Calendar } from 'lucide-react';

interface ScheduleDialogProps {
  mode: 'ai' | 'manual';
  onScheduleCreated: () => void;
}

interface Course {
  id: string;
  name: string;
  subjects: Subject[];
}

interface Subject {
  id: string;
  name: string;
  hours_per_week: number;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ mode, onScheduleCreated }) => {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    week_start_date: '',
    week_end_date: ''
  });

  useEffect(() => {
    if (open) {
      fetchCourses();
      setDefaultDates();
    }
  }, [open]);

  const setDefaultDates = () => {
    const today = new Date();
    const monday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    setFormData(prev => ({
      ...prev,
      week_start_date: monday.toISOString().split('T')[0],
      week_end_date: friday.toISOString().split('T')[0]
    }));
  };

  const fetchCourses = async () => {
    if (!profile?.institution_id) return;

    try {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          id,
          name,
          subjects (
            id,
            name,
            hours_per_week
          )
        `)
        .eq('institution_id', profile.institution_id)
        .eq('is_active', true);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to load courses',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.institution_id) return;

    setLoading(true);
    try {
      const { data: schedule, error } = await supabase
        .from('schedules')
        .insert({
          ...formData,
          institution_id: profile.institution_id,
          generated_by: profile.user_id,
          generation_method: mode
        })
        .select()
        .single();

      if (error) throw error;

      if (mode === 'ai') {
        await generateAISchedule(schedule.id);
      }

      toast({
        title: 'Success',
        description: `Schedule ${mode === 'ai' ? 'generated' : 'created'} successfully`
      });
      
      setFormData({ name: '', week_start_date: '', week_end_date: '' });
      setOpen(false);
      onScheduleCreated();
    } catch (error) {
      console.error('Error creating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateAISchedule = async (scheduleId: string) => {
    // Simple AI scheduling logic - distribute subjects evenly
    const allSubjects = courses.flatMap(course => course.subjects);
    const timeSlots = [
      { day: 1, start: '08:00', end: '09:00' },
      { day: 1, start: '09:00', end: '10:00' },
      { day: 1, start: '10:00', end: '11:00' },
      { day: 2, start: '08:00', end: '09:00' },
      { day: 2, start: '09:00', end: '10:00' },
      { day: 3, start: '08:00', end: '09:00' },
      { day: 3, start: '09:00', end: '10:00' },
      { day: 4, start: '08:00', end: '09:00' },
      { day: 4, start: '09:00', end: '10:00' },
      { day: 5, start: '08:00', end: '09:00' }
    ];

    // Get available teachers
    const { data: teachers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('institution_id', profile?.institution_id)
      .eq('role', 'teacher');

    if (!teachers || teachers.length === 0) return;

    const scheduleEntries = [];
    let slotIndex = 0;

    for (const subject of allSubjects) {
      for (let i = 0; i < subject.hours_per_week && slotIndex < timeSlots.length; i++) {
        const slot = timeSlots[slotIndex];
        const teacher = teachers[slotIndex % teachers.length];

        scheduleEntries.push({
          schedule_id: scheduleId,
          subject_id: subject.id,
          teacher_id: teacher.user_id,
          day_of_week: slot.day,
          start_time: slot.start,
          end_time: slot.end,
          room: `Room ${slotIndex + 1}`
        });

        slotIndex++;
      }
    }

    if (scheduleEntries.length > 0) {
      await supabase
        .from('schedule_entries')
        .insert(scheduleEntries);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={mode === 'ai' ? 'default' : 'outline'}>
          {mode === 'ai' ? (
            <><Brain className="h-4 w-4 mr-2" />AI Generate</>
          ) : (
            <><Calendar className="h-4 w-4 mr-2" />Manual Create</>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'ai' ? 'Generate AI Schedule' : 'Create Manual Schedule'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'ai' 
              ? 'Let AI create an optimal schedule based on available teachers and courses'
              : 'Create a new schedule that you can manually populate'
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Schedule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Week 1 Schedule"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="week_start_date">Start Date</Label>
              <Input
                id="week_start_date"
                type="date"
                value={formData.week_start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, week_start_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="week_end_date">End Date</Label>
              <Input
                id="week_end_date"
                type="date"
                value={formData.week_end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, week_end_date: e.target.value }))}
                required
              />
            </div>
          </div>
          
          {mode === 'ai' && courses.length === 0 && (
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <p>No courses found. Please add courses and subjects first to generate a schedule.</p>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || (mode === 'ai' && courses.length === 0)}>
              {loading ? 'Creating...' : (mode === 'ai' ? 'Generate' : 'Create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;