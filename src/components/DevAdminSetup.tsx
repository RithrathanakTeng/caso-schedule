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

const DevAdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('dev@admin.com');
  const [credentials, setCredentials] = useState<DevCredentials | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createDevAdmin = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-dev-admin', {
        body: { email }
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

        <Button 
          onClick={createDevAdmin} 
          disabled={loading || !email}
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