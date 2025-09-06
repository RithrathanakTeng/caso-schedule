import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { BookOpen } from 'lucide-react';

interface AddCourseDialogProps {
  onCourseAdded: () => void;
}

const AddCourseDialog: React.FC<AddCourseDialogProps> = ({ onCourseAdded }) => {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_khmer: '',
    code: '',
    description: '',
    hours_per_week: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.institution_id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...formData,
          institution_id: profile.institution_id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Course added successfully'
      });
      
      setFormData({ name: '', name_khmer: '', code: '', description: '', hours_per_week: 1 });
      setOpen(false);
      onCourseAdded();
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: 'Error',
        description: 'Failed to add course',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookOpen className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course for your institution
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="name_khmer">Course Name (Khmer)</Label>
            <Input
              id="name_khmer"
              value={formData.name_khmer}
              onChange={(e) => setFormData(prev => ({ ...prev, name_khmer: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="code">Course Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="hours_per_week">Hours Per Week</Label>
            <Input
              id="hours_per_week"
              type="number"
              min="1"
              value={formData.hours_per_week}
              onChange={(e) => setFormData(prev => ({ ...prev, hours_per_week: parseInt(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseDialog;