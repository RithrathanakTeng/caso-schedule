import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, School, CheckCircle, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurchaseAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionNameKhmer, setInstitutionNameKhmer] = useState('');
  const { toast } = useToast();

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !institutionName) {
      toast({
        title: "Missing Information",
        description: "Please provide email and institution name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-payment', {
        body: {
          email,
          institutionName,
          institutionNameKhmer
        }
      });

      if (error) {
        throw error;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to Payment",
        description: "Complete your purchase in the new tab",
      });
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create payment session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        {/* Back to Auth Link */}
        <Link 
          to="/auth" 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>

        <Card className="border-primary/20 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 p-4 bg-gradient-primary rounded-full w-fit">
              <Crown className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl mb-2">Get Admin Access</CardTitle>
            <CardDescription className="text-lg">
              Purchase administrative access to create your own institution and manage scheduling
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Pricing */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
              <div className="text-4xl font-bold text-primary mb-2">$99</div>
              <div className="text-muted-foreground">One-time payment for admin license</div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">What's Included:</h3>
              <div className="grid gap-3">
                {[
                  'Full administrative dashboard',
                  'Create and manage your institution',
                  'Add unlimited coordinators and teachers',
                  'AI-powered scheduling tools',
                  'Bilingual interface (English/Khmer)',
                  'Complete user management system'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Purchase Form */}
            <form onSubmit={handlePurchase} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@your-school.edu"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    This will be your admin login email
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input
                    id="institution"
                    type="text"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    placeholder="Royal University of Fine Arts"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="institution-khmer">Institution Name (Khmer)</Label>
                  <Input
                    id="institution-khmer"
                    type="text"
                    value={institutionNameKhmer}
                    onChange={(e) => setInstitutionNameKhmer(e.target.value)}
                    placeholder="សាកលវិទ្យាល័យភូមិន្ទវិចិត្រសិល្បៈ"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Optional: Institution name in Khmer
                  </p>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg" 
                variant="hero"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Crown className="h-5 w-5 mr-2" />
                    Purchase Admin Access - $99
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              <p>Secure payment powered by Stripe</p>
              <p>After purchase, you'll receive login credentials via email</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PurchaseAdmin;