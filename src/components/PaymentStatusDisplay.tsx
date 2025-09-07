import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Crown, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentStatus {
  id: string;
  institution_id: string;
  stripe_customer_id?: string;
  subscription_active: boolean;
  subscription_tier?: string;
  payment_date?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

const PaymentStatusDisplay: React.FC = () => {
  const { profile, institution, hasRole } = useAuth();
  const { toast } = useToast();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPaymentStatus = async () => {
    if (!profile?.institution_id || !hasRole('admin')) return;

    try {
      const { data, error } = await supabase
        .from('payment_status')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      setPaymentStatus(data);
    } catch (error) {
      console.error('Error fetching payment status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseAccess = () => {
    // Navigate to purchase page
    window.location.href = '/purchase-admin';
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: 'Error',
        description: 'Failed to open customer portal',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPaymentStatus();
  }, [profile?.institution_id]);

  if (!hasRole('admin')) {
    return null; // Only show to admins
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/3"></div>
            <div className="h-8 bg-muted rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isExpired = paymentStatus?.expires_at ? 
    new Date(paymentStatus.expires_at) < new Date() : false;
  
  const hasActiveSubscription = paymentStatus?.subscription_active && !isExpired;

  return (
    <Card className={hasActiveSubscription ? 'border-success' : 'border-warning'}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveSubscription ? (
              <Crown className="h-5 w-5 text-success" />
            ) : (
              <CreditCard className="h-5 w-5 text-warning" />
            )}
            <CardTitle>Payment & Subscription Status</CardTitle>
          </div>
          <Badge variant={hasActiveSubscription ? 'default' : 'destructive'}>
            {hasActiveSubscription ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <CardDescription>
          Manage your institution's subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!paymentStatus ? (
          // No payment record found
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
            <h3 className="text-lg font-semibold mb-2">Payment Required</h3>
            <p className="text-muted-foreground mb-6">
              To unlock all features and start using the scheduling system, 
              please purchase administrative access for your institution.
            </p>
            <Button onClick={handlePurchaseAccess} size="lg">
              <CreditCard className="h-4 w-4 mr-2" />
              Purchase Access
            </Button>
          </div>
        ) : hasActiveSubscription ? (
          // Active subscription
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="font-medium">Active Subscription</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Plan</label>
                <p className="text-lg font-semibold">
                  {paymentStatus.subscription_tier || 'Standard'} Plan
                </p>
              </div>
              
              {paymentStatus.payment_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                  <p className="text-lg">
                    {new Date(paymentStatus.payment_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              {paymentStatus.expires_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expires</label>
                  <p className="text-lg">
                    {new Date(paymentStatus.expires_at).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Institution</label>
                <p className="text-lg">{institution?.name}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                onClick={handleManageSubscription} 
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button>
            </div>
          </div>
        ) : (
          // Expired or inactive subscription
          <div className="text-center py-6">
            <AlertTriangle className="h-12 w-12 mx-auto text-warning mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {isExpired ? 'Subscription Expired' : 'Subscription Inactive'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isExpired 
                ? 'Your subscription has expired. Renew to continue using all features.'
                : 'Your subscription is currently inactive. Please contact support or renew your plan.'
              }
            </p>
            <div className="space-y-2">
              <Button onClick={handlePurchaseAccess}>
                <CreditCard className="h-4 w-4 mr-2" />
                Renew Subscription
              </Button>
              {paymentStatus.stripe_customer_id && (
                <Button 
                  onClick={handleManageSubscription} 
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Billing
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatusDisplay;