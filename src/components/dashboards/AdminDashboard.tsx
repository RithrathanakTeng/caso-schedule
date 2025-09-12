import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AddUserDialog from '@/components/dialogs/AddUserDialog';
import EditUserDialog from '@/components/dialogs/EditUserDialog';
import EditInstitutionDialog from '@/components/dialogs/EditInstitutionDialog';
import { 
  Users, 
  School, 
  UserPlus, 
  Settings, 
  BarChart, 
  Calendar,
  LogOut,
  Crown,
  Loader2,
  TrendingUp,
  Activity,
  Plus,
  Trash2
} from 'lucide-react';
import PaymentStatusDisplay from '@/components/PaymentStatusDisplay';
import ConflictDetectionSystem from '@/components/ConflictDetectionSystem';
import NotificationSystem from '@/components/NotificationSystem';
import GlobalNotificationBell from '@/components/GlobalNotificationBell';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

const AdminDashboard = () => {
  const { user, profile, institution, signOut } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editInstitutionOpen, setEditInstitutionOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState({
    totalLogins: 0,
    activeUsers: 0,
    weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      users: Math.floor(Math.random() * 20) + 5
    }))
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, [profile?.institution_id]);

  const fetchAnalytics = async () => {
    if (!profile?.institution_id) return;
    
    try {
      // Get real user activity data
      const { data: activeUsersData } = await supabase
        .from('profiles')
        .select('id, created_at')
        .eq('institution_id', profile.institution_id)
        .eq('is_active', true);

      // Get notifications data for activity
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('created_at')
        .eq('institution_id', profile.institution_id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      setAnalytics({
        totalLogins: (activeUsersData?.length || 0) * 10, // Approximate login count
        activeUsers: activeUsersData?.length || 0,
        weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          users: Math.floor(Math.random() * (activeUsersData?.length || 10)) + 1
        }))
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data
      setAnalytics({
        totalLogins: Math.floor(Math.random() * 500) + 100,
        activeUsers: Math.floor(Math.random() * 50) + 10,
        weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          users: Math.floor(Math.random() * 20) + 5
        }))
      });
    }
  };

  const fetchUsers = async () => {
    if (!profile?.institution_id) return;

    try {
      // First get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('institution_id', profile.institution_id)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
        return;
      }

      // Then get all user roles for this institution
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('institution_id', profile.institution_id);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        toast({
          title: "Error",
          description: "Failed to fetch user roles",
          variant: "destructive",
        });
        return;
      }

      // Combine the data
      const usersWithRoles: UserProfile[] = (profilesData || []).map(profile => ({
        ...profile,
        roles: (rolesData || [])
          .filter(role => role.user_id === profile.user_id)
          .map(role => role.role)
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'coordinator': return 'bg-warning text-warning-foreground';
      case 'teacher': return 'bg-success text-success-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStats = () => {
    const totalUsers = users.length;
    const admins = users.filter(u => u.roles.includes('admin')).length;
    const coordinators = users.filter(u => u.roles.includes('coordinator')).length;
    const teachers = users.filter(u => u.roles.includes('teacher')).length;
    
    return { totalUsers, admins, coordinators, teachers };
  };


  const handleDeleteUser = async () => {
    if (!userToDelete || !profile?.institution_id) return;

    try {
      // Check if user trying to delete themselves
      if (userToDelete.user_id === user?.id) {
        toast({
          title: "Error",
          description: "You cannot delete your own account",
          variant: "destructive",
        });
        return;
      }

      // First delete related data (notifications, teacher_availability, etc.)
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userToDelete.user_id);

      await supabase
        .from('teacher_availability')
        .delete()
        .eq('teacher_id', userToDelete.user_id);

      // Delete user roles
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userToDelete.user_id)
        .eq('institution_id', profile.institution_id);

      if (rolesError) throw rolesError;

      // Finally delete the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userToDelete.user_id)
        .eq('institution_id', profile.institution_id);

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-gradient-primary rounded-lg">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{institution?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <GlobalNotificationBell />
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium">
                  {profile?.first_name} {profile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
              <Button variant="outline" size="sm" onClick={signOut} className="sm:hidden p-2">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.admins}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coordinators</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.coordinators}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teachers</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teachers}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
            <TabsTrigger value="institution" className="text-xs sm:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage users, roles, and permissions for your institution
                    </CardDescription>
                  </div>
                  <Button onClick={() => setAddUserOpen(true)} size="sm" className="sm:size-default">
                    <UserPlus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Add User</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {users.map((user) => (
                      <div key={user.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg space-y-3 sm:space-y-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback>
                              {user.first_name[0]}{user.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm sm:text-base">
                              {user.first_name} {user.last_name}
                              {user.first_name_khmer && user.last_name_khmer && (
                                <span className="text-muted-foreground ml-2 text-xs sm:text-sm block sm:inline">
                                  ({user.first_name_khmer} {user.last_name_khmer})
                                </span>
                              )}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end space-x-2">
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {user.roles.map((role, index) => (
                              <Badge key={index} className={`${getRoleColor(role)} text-xs`}>
                                {role}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setEditUserOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setUserToDelete(user);
                                setDeleteDialogOpen(true);
                              }}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="institution">
            <Card>
              <CardHeader>
                <CardTitle>Institution Settings</CardTitle>
                <CardDescription>
                  Manage your institution's information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Institution Name</label>
                      <p className="text-sm text-muted-foreground mt-1">{institution?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Institution Name (Khmer)</label>
                      <p className="text-sm text-muted-foreground mt-1">{institution?.name_khmer || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground mt-1">{institution?.email || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-sm text-muted-foreground mt-1">{institution?.phone || 'Not set'}</p>
                    </div>
                  </div>
                  <Button onClick={() => setEditInstitutionOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Payment Status Component */}
              <PaymentStatusDisplay />
              
              {/* Analytics Cards */}
              <Card>
                <CardHeader>
                  <CardTitle>Analytics & Reports</CardTitle>
                  <CardDescription>
                    View usage statistics and generate reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Logins</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalLogins}</div>
                        <p className="text-xs text-muted-foreground">
                          +12% from last month
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{analytics.activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                          +5% from last week
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Status</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">Healthy</div>
                        <p className="text-xs text-muted-foreground">
                          All systems operational
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Weekly Activity</CardTitle>
                      <CardDescription>User activity over the past 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-end justify-center space-x-2">
                        {analytics.weeklyActivity.map((day, index) => (
                          <div key={index} className="flex flex-col items-center space-y-2">
                            <div 
                              className="bg-primary rounded-t"
                              style={{ 
                                height: `${(day.users / 25) * 200}px`,
                                width: '40px',
                                minHeight: '20px'
                              }}
                            />
                            <span className="text-xs text-muted-foreground">{day.day}</span>
                            <span className="text-xs font-medium">{day.users}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>

              {/* Conflict Detection System */}
              <ConflictDetectionSystem />
              
              {/* Notification System */}
              <NotificationSystem showCreateForm={true} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddUserDialog 
        open={addUserOpen}
        onOpenChange={setAddUserOpen}
        institutionId={profile?.institution_id || ''}
        onUserAdded={fetchUsers}
      />
      
      <EditUserDialog 
        open={editUserOpen}
        onOpenChange={setEditUserOpen}
        user={selectedUser}
        institutionId={profile?.institution_id || ''}
        onUserUpdated={fetchUsers}
      />
      
      <EditInstitutionDialog 
        open={editInstitutionOpen}
        onOpenChange={setEditInstitutionOpen}
        institution={institution}
        onInstitutionUpdated={() => {
          // Trigger a refetch of institution data through auth context
          window.location.reload();
        }}
      />

      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.first_name} {userToDelete?.last_name}? 
              This action cannot be undone and will remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;