import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, Crown, AlertTriangle, Copy, Eye, EyeOff } from 'lucide-react';

const AdminSetup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [adminCredentials, setAdminCredentials] = useState<{
    email: string;
    tempPassword: string;
    institutionName: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const sessionId = searchParams.get('session_id');
  const email = searchParams.get('email');
  const institutionName = searchParams.get('institution');
  const institutionNameKhmer = searchParams.get('institution_km');

  useEffect(() => {
    if (!sessionId || !email || !institutionName) {
      setVerificationStatus('error');
      setLoading(false);
      return;
    }

    verifyPaymentAndSetupAdmin();
  }, [sessionId, email, institutionName]);

  const verifyPaymentAndSetupAdmin = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('verify-admin-payment', {
        body: { sessionId }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setAdminCredentials({
          email: email!,
          tempPassword: data.tempPassword,
          institutionName: institutionName!
        });
        setVerificationStatus('success');
        
        toast({
          title: "Admin Account Created!",
          description: "Your institution and admin account have been set up successfully.",
        });
      } else {
        throw new Error(data.error || 'Failed to verify payment');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      toast({
        title: "Setup Failed",
        description: error.message || "Failed to set up admin account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard",
    });
  };

  const handleContinueToLogin = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2">Setting Up Your Admin Account</h2>
              <p className="text-muted-foreground">
                Please wait while we verify your payment and create your institution...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-destructive/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h2 className="text-xl font-semibold mb-2">Setup Failed</h2>
              <p className="text-muted-foreground mb-6">
                There was an issue setting up your admin account. Please contact support.
              </p>
              <Button onClick={() => navigate('/auth')} variant="outline">
                Back to Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-success/20 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 p-4 bg-gradient-to-r from-success/20 to-primary/20 rounded-full w-fit">
            <CheckCircle className="h-12 w-12 text-success" />
          </div>
          <CardTitle className="text-3xl mb-2 text-success">Welcome, Administrator!</CardTitle>
          <CardDescription className="text-lg">
            Your admin account and institution have been successfully created
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Institution Info */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-2">Institution Created</h3>
            <p className="text-2xl font-bold text-primary">{adminCredentials?.institutionName}</p>
            {institutionNameKhmer && (
              <p className="text-lg text-muted-foreground">{decodeURIComponent(institutionNameKhmer)}</p>
            )}
          </div>

          {/* Admin Credentials */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center">
              <Crown className="h-5 w-5 mr-2 text-warning" />
              Your Admin Login Credentials
            </h3>
            
            <div className="bg-background border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="font-mono text-lg">{adminCredentials?.email}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(adminCredentials?.email || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Temporary Password</label>
                  <div className="flex items-center space-x-2">
                    <p className="font-mono text-lg">
                      {showPassword ? adminCredentials?.tempPassword : '••••••••••••'}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(adminCredentials?.tempPassword || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <h4 className="font-semibold text-warning mb-2">Important Notes:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Save these credentials in a secure location</li>
              <li>• Change your password after first login</li>
              <li>• You can now create accounts for coordinators and teachers</li>
              <li>• Access your admin dashboard to start setting up schedules</li>
            </ul>
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleContinueToLogin}
            className="w-full h-12 text-lg" 
            variant="hero"
          >
            <Crown className="h-5 w-5 mr-2" />
            Continue to Admin Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;