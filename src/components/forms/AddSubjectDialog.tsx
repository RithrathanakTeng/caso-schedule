import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Loader2 } from 'lucide-react';

interface AddSubjectDialogProps {
  courseId: string;
  courseName: string;
  onSubjectAdded: () => void;
}

const AddSubjectDialog = ({ courseId, courseName, onSubjectAdded }: AddSubjectDialogProps) => {
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    name_khmer: '',
    code: '',
    hours_per_week: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Subject name is required',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('subjects')
        .insert({
          name: formData.name.trim(),
          name_khmer: formData.name_khmer.trim() || null,
          code: formData.code.trim() || null,
          hours_per_week: formData.hours_per_week,
          course_id: courseId,
          institution_id: profile?.institution_id
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Subject "${formData.name}" added to ${courseName}`
      });

      setFormData({
        name: '',
        name_khmer: '',
        code: '',
        hours_per_week: 1
      });
      setIsOpen(false);
      onSubjectAdded();
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: 'Error',
        description: 'Failed to add subject',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Subject to {courseName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subject Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mathematics, Physics"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_khmer">Subject Name (Khmer)</Label>
            <Input
              id="name_khmer"
              value={formData.name_khmer}
              onChange={(e) => setFormData(prev => ({ ...prev, name_khmer: e.target.value }))}
              placeholder="ឈ្មោះមុខវិជ្ជាជាភាសាខ្មែរ"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="e.g., MATH101"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">Hours/Week</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                max="40"
                value={formData.hours_per_week}
                onChange={(e) => setFormData(prev => ({ ...prev, hours_per_week: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Subject
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSubjectDialog;