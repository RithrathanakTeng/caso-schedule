import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DevCredentials {
  email: string;
  password: string;
  user_id: string;
  institution: string;
}

interface Institution {
  id: string;
  name: string;
  name_khmer?: string;
}

const DevAdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [email, setEmail] = useState('dev@admin.com');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [credentials, setCredentials] = useState<DevCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [newInstitutionName, setNewInstitutionName] = useState('');
  const [showNewInstitutionForm, setShowNewInstitutionForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch institutions on component mount
  React.useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('id, name, name_khmer')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        
        setInstitutions(data || []);
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast({
          title: "Error",
          description: "Failed to load institutions",
          variant: "destructive",
        });
      } finally {
        setInstitutionsLoading(false);
      }
    };

    fetchInstitutions();
  }, [toast]);

  const handleInstitutionChange = (value: string) => {
    if (value === 'create-new') {
      setShowNewInstitutionForm(true);
      setSelectedInstitution('');
    } else {
      setShowNewInstitutionForm(false);
      setSelectedInstitution(value);
    }
  };

  const createDevAdmin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    let institutionId = selectedInstitution;

    // If creating a new institution, create it first
    if (showNewInstitutionForm) {
      if (!newInstitutionName.trim()) {
        toast({
          title: "Error",
          description: "Please enter an institution name",
          variant: "destructive",
        });
        return;
      }

      try {
        const { data: newInstitution, error: institutionError } = await supabase
          .from('institutions')
          .insert({
            name: newInstitutionName.trim(),
            is_active: true
          })
          .select()
          .single();

        if (institutionError) throw institutionError;
        institutionId = newInstitution.id;
      } catch (error: any) {
        console.error('Error creating institution:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to create institution",
          variant: "destructive",
        });
        return;
      }
    }

    if (!institutionId) {
      toast({
        title: "Error",
        description: "Please select or create an institution",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-dev-admin', {
        body: { 
          email,
          institutionId
        }
      });

      if (error) throw error;

      setCredentials(data);
      toast({
        title: "Success!",
        description: "Developer admin account created successfully",
      });
    } catch (error: any) {
      console.error('Error creating dev admin:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create developer admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (credentials) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-green-600">✅ Developer Admin Created!</CardTitle>
          <CardDescription>
            Your development admin account has been set up successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="flex items-center gap-2">
              <Input value={credentials.email} readOnly />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.email, "Email")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex items-center gap-2">
              <Input 
                type={showPassword ? "text" : "password"}
                value={credentials.password} 
                readOnly 
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(credentials.password, "Password")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Institution</Label>
            <Input value={credentials.institution} readOnly />
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => navigate('/auth')} 
              className="w-full"
            >
              Continue to Login
            </Button>
            <Button 
              variant="outline"
            onClick={() => {
              setCredentials(null);
              setEmail('dev@admin.com');
              setSelectedInstitution('');
              setShowNewInstitutionForm(false);
              setNewInstitutionName('');
            }}
              className="w-full"
            >
              Create Another Admin
            </Button>
          </div>

          <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
            <strong>Note:</strong> This is a development-only feature. Use these credentials to test the admin dashboard functionality.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>🛠️ Developer Admin Setup</CardTitle>
        <CardDescription>
          Create a development admin account for testing purposes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {institutionsLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading institutions...
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <select
                id="institution"
                value={showNewInstitutionForm ? 'create-new' : selectedInstitution}
                onChange={(e) => handleInstitutionChange(e.target.value)}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select an institution...</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name} {institution.name_khmer && `(${institution.name_khmer})`}
                  </option>
                ))}
                <option value="create-new">+ Create New Institution</option>
              </select>
            </div>

            {showNewInstitutionForm && (
              <div className="space-y-2">
                <Label htmlFor="newInstitution">New Institution Name</Label>
                <Input
                  id="newInstitution"
                  type="text"
                  value={newInstitutionName}
                  onChange={(e) => setNewInstitutionName(e.target.value)}
                  placeholder="Enter institution name"
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                disabled={loading}
              />
            </div>
          </>
        )}

        <Button 
          onClick={createDevAdmin} 
          disabled={loading || !email || (!selectedInstitution && !showNewInstitutionForm) || (showNewInstitutionForm && !newInstitutionName.trim()) || institutionsLoading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Admin...
            </>
          ) : (
            'Create Dev Admin Account'
          )}
        </Button>

        <div className="text-sm text-muted-foreground">
          This will create an admin account with the password "dev123456" for development testing.
        </div>
      </CardContent>
    </Card>
  );
};

export default DevAdminSetup;