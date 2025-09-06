import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  first_name_khmer?: string;
  last_name_khmer?: string;
  is_active: boolean;
  roles: ('admin' | 'coordinator' | 'teacher')[];
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserProfile | null;
  institutionId: string;
  onUserUpdated: () => void;
}

const EditUserDialog = ({ open, onOpenChange, user, institutionId, onUserUpdated }: EditUserDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    first_name_khmer: user?.first_name_khmer || '',
    last_name_khmer: user?.last_name_khmer || '',
    is_active: user?.is_active ?? true,
    roles: user?.roles || []
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        first_name_khmer: user.first_name_khmer || '',
        last_name_khmer: user.last_name_khmer || '',
        is_active: user.is_active,
        roles: user.roles
      });
    }
  }, [user]);

  const handleRoleChange = (role: 'admin' | 'coordinator' | 'teacher', checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      roles: checked 
        ? [...prev.roles, role]
        : prev.roles.filter(r => r !== role)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.first_name || !formData.last_name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          first_name_khmer: formData.first_name_khmer || null,
          last_name_khmer: formData.last_name_khmer || null,
          is_active: formData.is_active
        })
        .eq('user_id', user.user_id);

      if (profileError) throw profileError;

      // Update roles
      // First delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.user_id)
        .eq('institution_id', institutionId);

      if (deleteError) throw deleteError;

      // Then insert new roles
      if (formData.roles.length > 0) {
        const roleInserts = formData.roles.map(role => ({
          user_id: user.user_id,
          institution_id: institutionId,
          role
        }));

        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(roleInserts);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      onUserUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and roles
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name_khmer">First Name (Khmer)</Label>
              <Input
                id="first_name_khmer"
                value={formData.first_name_khmer}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name_khmer: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="last_name_khmer">Last Name (Khmer)</Label>
              <Input
                id="last_name_khmer"
                value={formData.last_name_khmer}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name_khmer: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input value={user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div>
            <Label>Roles</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.roles.includes('teacher')}
                  onCheckedChange={(checked) => handleRoleChange('teacher', checked)}
                />
                <Label>Teacher</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.roles.includes('coordinator')}
                  onCheckedChange={(checked) => handleRoleChange('coordinator', checked)}
                />
                <Label>Coordinator</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.roles.includes('admin')}
                  onCheckedChange={(checked) => handleRoleChange('admin', checked)}
                />
                <Label>Administrator</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label>Active User</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;