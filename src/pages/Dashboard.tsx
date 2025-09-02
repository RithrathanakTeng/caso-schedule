import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import CoordinatorDashboard from '@/components/dashboards/CoordinatorDashboard';
import TeacherDashboard from '@/components/dashboards/TeacherDashboard';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { user, loading, isPrimaryRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Render dashboard based on user's primary role
  if (isPrimaryRole('admin')) {
    return <AdminDashboard />;
  } else if (isPrimaryRole('coordinator')) {
    return <CoordinatorDashboard />;
  } else {
    return <TeacherDashboard />;
  }
};

export default Dashboard;