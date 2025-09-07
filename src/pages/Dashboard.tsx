import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import CoordinatorDashboard from '@/components/dashboards/CoordinatorDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, isPrimaryRole, profile, userRoles } = useAuth();

  console.log('🔧 Dashboard render:', { 
    user: user?.email, 
    loading, 
    hasProfile: !!profile,
    rolesCount: userRoles.length,
    roles: userRoles.map(r => r.role)
  });

  if (loading) {
    console.log('⏳ Dashboard showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🔄 No user, redirecting to auth');
    return <Navigate to="/auth" replace />;
  }

  // Render dashboard based on user's primary role
  console.log('🎯 Checking primary role...');
  if (isPrimaryRole('admin')) {
    console.log('👑 Rendering AdminDashboard');
    return <AdminDashboard />;
  } else if (isPrimaryRole('coordinator')) {
    console.log('⚙️ Rendering CoordinatorDashboard');
    return <CoordinatorDashboard />;
  } else {
    console.log('📚 Rendering TeacherDashboard');
    return <TeacherDashboard />;
  }
};

export default Dashboard;