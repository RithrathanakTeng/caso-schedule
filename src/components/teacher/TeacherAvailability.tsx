import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AvailabilitySlot {
  id?: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherAvailability = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAvailability = async () => {
    if (!user || !profile?.institution_id) return;

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('teacher_availability')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('institution_id', profile.institution_id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;

      setAvailability(data || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [user, profile]);

  const addNewSlot = () => {
    const newSlot: AvailabilitySlot = {
      day_of_week: 1, // Monday
      start_time: '09:00',
      end_time: '17:00',
      is_available: true,
      notes: ''
    };
    setAvailability([...availability, newSlot]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const removeSlot = (index: number) => {
    const updated = availability.filter((_, i) => i !== index);
    setAvailability(updated);
  };

  const saveAvailability = async () => {
    if (!user || !profile?.institution_id) return;

    try {
      setSaving(true);

      // Delete existing availability
      await supabase
        .from('teacher_availability')
        .delete()
        .eq('teacher_id', user.id)
        .eq('institution_id', profile.institution_id);

      // Insert new availability
      if (availability.length > 0) {
        const { error } = await supabase
          .from('teacher_availability')
          .insert(
            availability.map(slot => ({
              teacher_id: user.id,
              institution_id: profile.institution_id,
              day_of_week: slot.day_of_week,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_available: slot.is_available,
              notes: slot.notes || null
            }))
          );

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Availability saved successfully"
      });
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: "Error",
        description: "Failed to save availability",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          Loading availability...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Teaching Availability
        </CardTitle>
        <CardDescription>
          Set your preferred teaching hours and availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Time Slots</h3>
          <Button variant="outline" onClick={addNewSlot}>
            <Plus className="h-4 w-4 mr-2" />
            Add Slot
          </Button>
        </div>

        <div className="space-y-4">
          {availability.map((slot, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid grid-cols-4 gap-4 flex-1">
                    <div>
                      <Label htmlFor={`day-${index}`}>Day</Label>
                      <select
                        id={`day-${index}`}
                        className="w-full p-2 border rounded"
                        value={slot.day_of_week}
                        onChange={(e) => updateSlot(index, 'day_of_week', parseInt(e.target.value))}
                      >
                        {dayNames.map((day, dayIndex) => (
                          <option key={dayIndex} value={dayIndex}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`start-${index}`}>Start Time</Label>
                      <Input
                        id={`start-${index}`}
                        type="time"
                        value={slot.start_time}
                        onChange={(e) => updateSlot(index, 'start_time', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`end-${index}`}>End Time</Label>
                      <Input
                        id={`end-${index}`}
                        type="time"
                        value={slot.end_time}
                        onChange={(e) => updateSlot(index, 'end_time', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 pt-6">
                      <Switch
                        checked={slot.is_available}
                        onCheckedChange={(checked) => updateSlot(index, 'is_available', checked)}
                      />
                      <Label className="text-sm">
                        {slot.is_available ? 'Available' : 'Unavailable'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSlot(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label htmlFor={`notes-${index}`}>Notes (optional)</Label>
                <Textarea
                  id={`notes-${index}`}
                  placeholder="Any additional notes about this time slot..."
                  value={slot.notes || ''}
                  onChange={(e) => updateSlot(index, 'notes', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {availability.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4" />
            <p>No availability slots set</p>
            <p className="text-sm mt-1">Add your preferred teaching hours to help coordinators schedule classes</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={saveAvailability} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherAvailability;