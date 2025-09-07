import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, School, Users, GraduationCap, Crown, Play } from 'lucide-react';

interface Institution {
  id: string;
  name: string;
  name_khmer?: string;
}

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [showDemoRequest, setShowDemoRequest] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Fetch institutions
  useEffect(() => {
    const fetchInstitutions = async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name, name_khmer')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching institutions:', error);
        toast({
          title: "Error",
          description: "Failed to load institutions",
          variant: "destructive",
        });
      } else {
        setInstitutions(data || []);
      }
    };

    fetchInstitutions();
  }, [toast]);

  const handleSignIn = async (email: string, password: string) => {
    if (!selectedInstitution) {
      toast({
        title: "Institution Required",
        description: "Please select your institution",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string,
    firstNameKhmer?: string,
    lastNameKhmer?: string,
    role: 'teacher' | 'coordinator' = 'teacher'
  ) => {
    if (!selectedInstitution) {
      toast({
        title: "Institution Required",
        description: "Please select your institution",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          institution_id: selectedInstitution,
          first_name: firstName,
          last_name: lastName,
          first_name_khmer: firstNameKhmer,
          last_name_khmer: lastNameKhmer,
          role: role,
        }
      }
    });

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check Your Email",
        description: "We've sent you a confirmation link",
      });
    }
    setLoading(false);
  };

  const handleDemoRequest = async (name: string, email: string, institution: string, message?: string) => {
    setLoading(true);
    
    try {
      // Here you would typically send the demo request to your backend
      // For now, we'll just show a success message
      toast({
        title: "Demo Request Submitted",
        description: "We'll contact you within 24 hours to schedule your demo",
      });
      setShowDemoRequest(false);
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Failed to submit demo request. Please try again.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit">
            <School className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Caso Schedule Pro</CardTitle>
          <CardDescription>
            AI-Powered Academic Scheduling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label htmlFor="institution">Institution</Label>
            <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
              <SelectTrigger>
                <SelectValue placeholder="Select your institution" />
              </SelectTrigger>
              <SelectContent>
                {institutions.map((institution) => (
                  <SelectItem key={institution.id} value={institution.id}>
                    <div>
                      <div>{institution.name}</div>
                      {institution.name_khmer && (
                        <div className="text-sm text-muted-foreground">{institution.name_khmer}</div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!showDemoRequest ? (
            <>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <SignInForm onSubmit={handleSignIn} loading={loading} />
                </TabsContent>
                
                <TabsContent value="signup">
                  <SignUpForm onSubmit={handleSignUp} loading={loading} />
                </TabsContent>
              </Tabs>

              {/* Request Demo Button */}
              <div className="mt-4">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => setShowDemoRequest(true)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Request Demo
                </Button>
              </div>
            </>
          ) : (
            <DemoRequestForm 
              onSubmit={handleDemoRequest} 
              onCancel={() => setShowDemoRequest(false)}
              loading={loading} 
            />
          )}

          {/* Purchase Admin Access */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-px bg-border flex-1"></div>
                <span className="text-sm text-muted-foreground px-2">Need Admin Access?</span>
                <div className="h-px bg-border flex-1"></div>
              </div>
              
              <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Crown className="h-5 w-5 text-warning" />
                      <span className="font-medium">Create Your Institution</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Purchase admin access to set up your own school or university
                    </p>
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/purchase-admin">
                        <Crown className="h-4 w-4 mr-2" />
                        Get Admin License - $99
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SignInForm = ({ onSubmit, loading }: { onSubmit: (email: string, password: string) => void; loading: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="signin-email">Email</Label>
        <Input
          id="signin-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="signin-password">Password</Label>
        <Input
          id="signin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sign In
      </Button>
    </form>
  );
};

const SignUpForm = ({ onSubmit, loading }: { onSubmit: (email: string, password: string, firstName: string, lastName: string, firstNameKhmer?: string, lastNameKhmer?: string, role?: 'teacher' | 'coordinator') => void; loading: boolean }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstNameKhmer, setFirstNameKhmer] = useState('');
  const [lastNameKhmer, setLastNameKhmer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password, firstName, lastName, firstNameKhmer, lastNameKhmer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name">First Name</Label>
          <Input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="last-name">Last Name</Label>
          <Input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="first-name-khmer">First Name (Khmer)</Label>
          <Input
            id="first-name-khmer"
            type="text"
            value={firstNameKhmer}
            onChange={(e) => setFirstNameKhmer(e.target.value)}
            placeholder="ឈ្មោះដំបូង"
          />
        </div>
        <div>
          <Label htmlFor="last-name-khmer">Last Name (Khmer)</Label>
          <Input
            id="last-name-khmer"
            type="text"
            value={lastNameKhmer}
            onChange={(e) => setLastNameKhmer(e.target.value)}
            placeholder="នាមត្រកូល"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Sign Up
      </Button>
    </form>
  );
};

const DemoRequestForm = ({ 
  onSubmit, 
  onCancel, 
  loading 
}: { 
  onSubmit: (name: string, email: string, institution: string, message?: string) => void; 
  onCancel: () => void;
  loading: boolean 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, email, institution, message);
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Request a Demo</h3>
        <p className="text-sm text-muted-foreground">
          See how Caso Schedule Pro can transform your academic scheduling
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="demo-name">Full Name</Label>
          <Input
            id="demo-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="demo-email">Email</Label>
          <Input
            id="demo-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="demo-institution">Institution Name</Label>
          <Input
            id="demo-institution"
            type="text"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Your school or university name"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="demo-message">Message (Optional)</Label>
          <Input
            id="demo-message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your scheduling needs"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Request
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Auth;