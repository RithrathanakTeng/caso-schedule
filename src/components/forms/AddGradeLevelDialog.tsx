import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddGradeLevelDialogProps {
  onGradeLevelAdded?: () => void;
}

const AddGradeLevelDialog = ({ onGradeLevelAdded }: AddGradeLevelDialogProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    grade_number: 9,
    name: '',
    name_khmer: ''
  });

  const handleSubmit = async () => {
    if (!profile?.institution_id) return;
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Grade level name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from('grade_levels')
        .insert({
          institution_id: profile.institution_id,
          grade_number: formData.grade_number,
          name: formData.name.trim(),
          name_khmer: formData.name_khmer.trim() || null
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Error",
            description: "This grade level already exists",
            variant: "destructive"
          });
          return;
        }
        throw error;
      }

      toast({
        title: "Success",
        description: "Grade level created successfully"
      });

      // Reset form
      setFormData({
        grade_number: 9,
        name: '',
        name_khmer: ''
      });
      setOpen(false);
      onGradeLevelAdded?.();
    } catch (error) {
      console.error('Error creating grade level:', error);
      toast({
        title: "Error",
        description: "Failed to create grade level",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Grade Level
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Grade Level</DialogTitle>
          <DialogDescription>
            Create a new grade level for your high school
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grade_number">Grade Number *</Label>
            <Input
              id="grade_number"
              type="number"
              min="1"
              max="13"
              value={formData.grade_number}
              onChange={(e) => setFormData({...formData, grade_number: parseInt(e.target.value) || 9})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Grade Level Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Grade 9, Form 1, Year 9"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name_khmer">Grade Level Name (Khmer)</Label>
            <Input
              id="name_khmer"
              value={formData.name_khmer}
              onChange={(e) => setFormData({...formData, name_khmer: e.target.value})}
              placeholder="ថ្នាក់ទី៩"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Create Grade Level
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGradeLevelDialog;