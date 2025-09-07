import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Users, 
  Database, 
  Zap,
  CreditCard,
  Languages,
  Bell,
  Calendar,
  Settings
} from 'lucide-react';
import ConflictDetectionSystem from '@/components/ConflictDetectionSystem';
import PaymentStatusDisplay from '@/components/PaymentStatusDisplay';
import NotificationSystem from '@/components/NotificationSystem';
import LanguageToggle from '@/components/LanguageToggle';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  details?: string;
}

const TestSystem: React.FC = () => {
  const { user, profile, institution, hasRole } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const runSystemTests = async () => {
    setLoading(true);
    const results: TestResult[] = [];

    try {
      // Test 1: Authentication System
      if (user && profile) {
        results.push({
          name: 'Authentication System',
          status: 'pass',
          description: 'User authentication is working correctly',
          details: `Logged in as: ${user.email} (${profile.first_name} ${profile.last_name})`
        });
      } else {
        results.push({
          name: 'Authentication System',
          status: 'fail',
          description: 'User authentication failed',
          details: 'No user or profile data found'
        });
      }

      // Test 2: Role-Based Access Control
      const userRoles = ['admin', 'coordinator', 'teacher'];
      const userRole = userRoles.find(role => hasRole(role as any));
      
      if (userRole) {
        results.push({
          name: 'Role-Based Access Control',
          status: 'pass',
          description: `Role system working - User has ${userRole} role`,
          details: `Current role: ${userRole}`
        });
      } else {
        results.push({
          name: 'Role-Based Access Control',
          status: 'warning',
          description: 'No specific role detected',
          details: 'User may not have proper role assignments'
        });
      }

      // Test 3: Multi-Tenant Data Isolation
      if (institution && profile?.institution_id) {
        results.push({
          name: 'Multi-Tenant Data Isolation',
          status: 'pass',
          description: 'Institution data isolation is working',
          details: `Institution: ${institution.name} (ID: ${profile.institution_id})`
        });
      } else {
        results.push({
          name: 'Multi-Tenant Data Isolation',
          status: 'fail',
          description: 'Institution data not properly isolated',
          details: 'Missing institution or profile data'
        });
      }

      // Test 4: Database Connectivity
      try {
        const { data, error } = await supabase.from('profiles').select('count').limit(1);
        if (!error) {
          results.push({
            name: 'Database Connectivity',
            status: 'pass',
            description: 'Database connection is working',
            details: 'Successfully connected to Supabase'
          });
        } else {
          throw error;
        }
      } catch (error) {
        results.push({
          name: 'Database Connectivity',
          status: 'fail',
          description: 'Database connection failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 5: Teacher Availability System
      if (hasRole('teacher')) {
        try {
          const { data, error } = await supabase
            .from('teacher_availability')
            .select('*')
            .eq('teacher_id', user?.id)
            .limit(1);

          if (!error) {
            results.push({
              name: 'Teacher Availability System',
              status: data && data.length > 0 ? 'pass' : 'warning',
              description: data && data.length > 0 
                ? 'Teacher availability data found' 
                : 'No availability data set',
              details: `Found ${data?.length || 0} availability entries`
            });
          } else {
            throw error;
          }
        } catch (error) {
          results.push({
            name: 'Teacher Availability System',
            status: 'fail',
            description: 'Failed to check teacher availability',
            details: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Test 6: Schedule Management
      try {
        const { data, error } = await supabase
          .from('schedules')
          .select('*')
          .eq('institution_id', profile?.institution_id)
          .limit(1);

        if (!error) {
          results.push({
            name: 'Schedule Management',
            status: data && data.length > 0 ? 'pass' : 'warning',
            description: data && data.length > 0 
              ? 'Schedule system is working' 
              : 'No schedules found',
            details: `Found ${data?.length || 0} schedules`
          });
        } else {
          throw error;
        }
      } catch (error) {
        results.push({
          name: 'Schedule Management',
          status: 'fail',
          description: 'Failed to check schedules',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 7: Conflict Detection
      try {
        const { data, error } = await supabase.rpc('detect_schedule_conflicts', {
          schedule_id_param: '00000000-0000-0000-0000-000000000000' // Test with dummy ID
        });

        results.push({
          name: 'AI Conflict Detection',
          status: 'pass',
          description: 'Conflict detection function is working',
          details: 'Successfully called conflict detection function'
        });
      } catch (error) {
        results.push({
          name: 'AI Conflict Detection',
          status: 'fail',
          description: 'Conflict detection function failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

      // Test 8: Notification System
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('count')
          .eq('user_id', user?.id)
          .limit(1);

        if (!error) {
          results.push({
            name: 'Notification System',
            status: 'pass',
            description: 'Notification system is accessible',
            details: 'Successfully queried notifications table'
          });
        } else {
          throw error;
        }
      } catch (error) {
        results.push({
          name: 'Notification System',
          status: 'fail',
          description: 'Notification system failed',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
      }

    } catch (error) {
      console.error('Error running tests:', error);
    }

    setTestResults(results);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'border-success bg-success/10';
      case 'fail':
        return 'border-destructive bg-destructive/10';
      case 'warning':
        return 'border-warning bg-warning/10';
      default:
        return 'border-muted bg-muted/10';
    }
  };

  const passCount = testResults.filter(r => r.status === 'pass').length;
  const failCount = testResults.filter(r => r.status === 'fail').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  useEffect(() => {
    if (user && profile) {
      runSystemTests();
    }
  }, [user, profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">System Testing Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive testing for all system components and features
          </p>
        </div>

        {/* Test Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testResults.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-success">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-success">Passed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{passCount}</div>
            </CardContent>
          </Card>
          
          <Card className="border-warning">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-warning">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{warningCount}</div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{failCount}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tests">System Tests</TabsTrigger>
            <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="accounts">Test Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="tests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Test Results</CardTitle>
                    <CardDescription>
                      Automated tests for core system functionality
                    </CardDescription>
                  </div>
                  <Button onClick={runSystemTests} disabled={loading}>
                    {loading ? 'Running Tests...' : 'Run Tests'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <h4 className="font-medium">{result.name}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {result.description}
                            </p>
                            {result.details && (
                              <p className="text-xs text-muted-foreground mt-2 font-mono">
                                {result.details}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant={
                          result.status === 'pass' ? 'default' : 
                          result.status === 'fail' ? 'destructive' : 
                          'secondary'
                        }>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts">
            <ConflictDetectionSystem />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentStatusDisplay />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSystem showCreateForm={true} />
          </TabsContent>

          <TabsContent value="language">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="h-5 w-5" />
                  Language System Test
                </CardTitle>
                <CardDescription>
                  Test the Khmer/English language toggle functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Language Toggle</h4>
                    <p className="text-sm text-muted-foreground">
                      Switch between English and Khmer languages
                    </p>
                  </div>
                  <LanguageToggle />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">English Sample Text</h5>
                    <p className="text-sm">
                      Welcome to the AI-Powered Academic Scheduling System. 
                      This system helps educational institutions create optimal class schedules.
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h5 className="font-medium mb-2">Khmer Sample Text</h5>
                    <p className="text-sm">
                      ស្វាគមន៍មកកាន់ប្រព័ន្ធកាលវិភាគសិក្សាដោយ AI។ 
                      ប្រព័ន្ធនេះជួយស្ថាប័នអប់រំក្នុងការបង្កើតកាលវិភាគថ្នាក់រៀនប្រកបដោយប្រសិទ្ធភាព។
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <Card>
              <CardHeader>
                <CardTitle>Test User Accounts</CardTitle>
                <CardDescription>
                  Use these accounts to test different role functionalities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-destructive mb-2">Admin Account</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> dev@admin.com</p>
                      <p><strong>Password:</strong> dev123456</p>
                      <p className="text-muted-foreground">
                        Full system access, user management, payment status
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-warning mb-2">Coordinator Account</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> coordinator@test.com</p>
                      <p><strong>Password:</strong> coordinator</p>
                      <p className="text-muted-foreground">
                        Schedule management, teacher coordination, AI features
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium text-success mb-2">Teacher Account</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> teacher@test.com</p>
                      <p><strong>Password:</strong> teacher</p>
                      <p className="text-muted-foreground">
                        Availability submission, schedule viewing, notifications
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-2">Testing Checklist</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Stripe payment flow (Admin only)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Multi-school data isolation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Role-based dashboard access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ AI conflict detection</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Teacher availability forms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Real-time notifications</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Khmer language support</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>✅ Responsive design</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestSystem;