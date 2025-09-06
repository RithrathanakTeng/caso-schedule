import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  name_khmer?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_khmer?: string;
  website?: string;
}

interface EditInstitutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  institution: Institution | null;
  onInstitutionUpdated: () => void;
}

const EditInstitutionDialog = ({ open, onOpenChange, institution, onInstitutionUpdated }: EditInstitutionDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: institution?.name || '',
    name_khmer: institution?.name_khmer || '',
    email: institution?.email || '',
    phone: institution?.phone || '',
    address: institution?.address || '',
    address_khmer: institution?.address_khmer || '',
    website: institution?.website || ''
  });
  const { toast } = useToast();

  React.useEffect(() => {
    if (institution) {
      setFormData({
        name: institution.name,
        name_khmer: institution.name_khmer || '',
        email: institution.email || '',
        phone: institution.phone || '',
        address: institution.address || '',
        address_khmer: institution.address_khmer || '',
        website: institution.website || ''
      });
    }
  }, [institution]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !formData.name) {
      toast({
        title: "Error",
        description: "Institution name is required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('institutions')
        .update({
          name: formData.name,
          name_khmer: formData.name_khmer || null,
          email: formData.email || null,
          phone: formData.phone || null,
          address: formData.address || null,
          address_khmer: formData.address_khmer || null,
          website: formData.website || null
        })
        .eq('id', institution.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Institution settings updated successfully",
      });

      onInstitutionUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating institution:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update institution",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!institution) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Institution Settings</DialogTitle>
          <DialogDescription>
            Update your institution's information and contact details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Institution Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="name_khmer">Institution Name (Khmer)</Label>
              <Input
                id="name_khmer"
                value={formData.name_khmer}
                onChange={(e) => setFormData(prev => ({ ...prev, name_khmer: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="address_khmer">Address (Khmer)</Label>
            <Textarea
              id="address_khmer"
              value={formData.address_khmer}
              onChange={(e) => setFormData(prev => ({ ...prev, address_khmer: e.target.value }))}
              rows={3}
            />
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
                'Update Settings'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInstitutionDialog;