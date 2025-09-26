import { supabase } from '@/integrations/supabase/client';

interface ExportData {
  users?: any[];
  schedules?: any[];
  notifications?: any[];
  analytics?: any[];
}

export const exportToCSV = (data: any[], filename: string) => {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        // Escape quotes in strings
        return `"${String(value || '').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportToJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { 
    type: 'application/json;charset=utf-8;' 
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const exportUsers = async (institutionId: string) => {
  try {
    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('institution_id', institutionId);

    if (profilesError) throw profilesError;

    // Get user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('institution_id', institutionId);

    if (rolesError) throw rolesError;

    // Combine data
    const usersData = profiles?.map(profile => ({
      ...profile,
      roles: roles?.filter(role => role.user_id === profile.user_id).map(r => r.role) || []
    })) || [];

    return usersData;
  } catch (error) {
    console.error('Error exporting users:', error);
    throw error;
  }
};

export const exportSchedules = async (institutionId: string) => {
  try {
    // Get basic schedule data without complex joins
    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .eq('institution_id', institutionId);

    if (error) {
      console.warn('Error fetching schedules:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error exporting schedules:', error);
    return [];
  }
};

export const exportNotifications = async (institutionId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('institution_id', institutionId);

    if (error) {
      console.warn('Error fetching notifications:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error exporting notifications:', error);
    return [];
  }
};

export const exportAllData = async (institutionId: string): Promise<ExportData> => {
  try {
    const [users, schedules, notifications] = await Promise.all([
      exportUsers(institutionId),
      exportSchedules(institutionId),
      exportNotifications(institutionId)
    ]);

    return {
      users,
      schedules,
      notifications,
      analytics: [] // Can be expanded with analytics data
    };
  } catch (error) {
    console.error('Error exporting all data:', error);
    throw error;
  }
};