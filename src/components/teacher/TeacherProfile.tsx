import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save, Edit, Mail, Phone, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TeacherProfile = () => {
  const { profile, institution } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    first_name_khmer: profile?.first_name_khmer || '',
    last_name_khmer: profile?.last_name_khmer || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile?.user_id) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          first_name_khmer: formData.first_name_khmer || null,
          last_name_khmer: formData.last_name_khmer || null,
          phone: formData.phone || null,
          avatar_url: formData.avatar_url || null,
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      first_name_khmer: profile?.first_name_khmer || '',
      last_name_khmer: profile?.last_name_khmer || '',
      phone: profile?.phone || '',
      avatar_url: profile?.avatar_url || ''
    });
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={isEditing ? formData.avatar_url : profile?.avatar_url} />
            <AvatarFallback className="text-lg">
              {isEditing 
                ? `${formData.first_name?.[0] || ''}${formData.last_name?.[0] || ''}`
                : `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`
              }
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.avatar_url}
                  onChange={(e) => handleInputChange('avatar_url', e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium">
                  {profile?.first_name} {profile?.last_name}
                </h3>
                {profile?.first_name_khmer && profile?.last_name_khmer && (
                  <p className="text-muted-foreground">
                    {profile.first_name_khmer} {profile.last_name_khmer}
                  </p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {profile?.email}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name *</Label>
            {isEditing ? (
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            ) : (
              <p className="text-sm py-2">{profile?.first_name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name *</Label>
            {isEditing ? (
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            ) : (
              <p className="text-sm py-2">{profile?.last_name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="first_name_khmer">First Name (Khmer)</Label>
            {isEditing ? (
              <Input
                id="first_name_khmer"
                value={formData.first_name_khmer}
                onChange={(e) => handleInputChange('first_name_khmer', e.target.value)}
              />
            ) : (
              <p className="text-sm py-2">{profile?.first_name_khmer || 'Not provided'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="last_name_khmer">Last Name (Khmer)</Label>
            {isEditing ? (
              <Input
                id="last_name_khmer"
                value={formData.last_name_khmer}
                onChange={(e) => handleInputChange('last_name_khmer', e.target.value)}
              />
            ) : (
              <p className="text-sm py-2">{profile?.last_name_khmer || 'Not provided'}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            {isEditing ? (
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            ) : (
              <p className="text-sm py-2 flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {profile?.phone || 'Not provided'}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Institution</Label>
            <p className="text-sm py-2 flex items-center gap-1">
              <Building className="h-3 w-3" />
              {institution?.name}
            </p>
          </div>
        </div>

        {/* Read-only Email */}
        <div className="space-y-2">
          <Label>Email Address</Label>
          <p className="text-sm py-2 text-muted-foreground">
            {profile?.email} (Cannot be changed)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherProfile;