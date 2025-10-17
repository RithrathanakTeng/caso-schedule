import { supabase } from '@/integrations/supabase/client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

export const exportToPDF = (data: any[], filename: string, title?: string) => {
  if (!data.length) return;

  const doc = new jsPDF('l', 'mm', 'a4'); // Landscape for better table display
  
  // Header section with branding
  doc.setFillColor(37, 99, 235); // Primary blue
  doc.rect(0, 0, 297, 35, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title || 'Schedule Export', 14, 15);
  
  // Subtitle with date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const exportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generated on ${exportDate}`, 14, 25);
  
  // Reset text color for table
  doc.setTextColor(0, 0, 0);

  // Prepare headers with better formatting
  const headers = Object.keys(data[0]).map(header => 
    header.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
  
  const originalHeaders = Object.keys(data[0]);
  
  // Prepare rows with better formatting
  const rows = data.map(row => 
    originalHeaders.map(header => {
      const value = row[header];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      if (typeof value === 'object' && value !== null) {
        if (value.name) return value.name;
        return JSON.stringify(value);
      }
      // Format dates nicely
      if (header.includes('date') || header.includes('time')) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            return date.toLocaleDateString('en-US');
          }
        } catch (e) {
          // Not a date, continue
        }
      }
      return String(value || '-');
    })
  );

  // Add table with enhanced styling
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 40,
    theme: 'striped',
    headStyles: { 
      fillColor: [37, 99, 235], // Primary blue
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4
    },
    styles: { 
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle'
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Light gray
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' }
    },
    margin: { top: 40, left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      
      // Watermark
      doc.text(
        'Caso Schedule Pro',
        doc.internal.pageSize.width - 14,
        doc.internal.pageSize.height - 10,
        { align: 'right' }
      );
    }
  });

  doc.save(`${filename}.pdf`);
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