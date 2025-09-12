import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, X, Plus, Clock, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  institution_id: string;
  user_id: string;
  title: string;
  title_khmer?: string;
  message: string;
  message_khmer?: string;
  type: 'info' | 'warning' | 'success' | 'error';
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

interface NotificationSystemProps {
  showCreateForm?: boolean;
  targetUserId?: string;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ 
  showCreateForm = false,
  targetUserId
}) => {
  const { user, profile, hasRole } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    title_khmer: '',
    message: '',
    message_khmer: '',
    type: 'info' as const,
    target_user_id: targetUserId || '',
    broadcast_to: 'individual' as 'individual' | 'all_teachers' | 'all_coordinators' | 'all_users',
    expires_at: ''
  });

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications((data as Notification[]) || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      toast({
        title: 'Notification Deleted',
        description: 'Notification has been removed',
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive',
      });
    }
  };

  const createNotification = async () => {
    if (!profile?.institution_id || !newNotification.title || !newNotification.message) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    console.log('📧 NotificationSystem: Creating notification with broadcast type:', newNotification.broadcast_to);

    try {
      let targetUsers: string[] = [];

      // Determine target users based on broadcast type
      if (newNotification.broadcast_to === 'individual') {
        targetUsers = [newNotification.target_user_id || user?.id!];
      } else {
        // Get users based on broadcast type
        let roleFilter: 'teacher' | 'coordinator' | 'admin' | null = null;
        switch (newNotification.broadcast_to) {
          case 'all_teachers':
            roleFilter = 'teacher';
            break;
          case 'all_coordinators':
            roleFilter = 'coordinator';
            break;
          case 'all_users':
            roleFilter = null; // No filter - all users
            break;
        }

        const query = supabase
          .from('user_roles')
          .select('user_id')
          .eq('institution_id', profile.institution_id);

        if (roleFilter) {
          query.eq('role', roleFilter);
        }

        const { data: userRoles, error: rolesError } = await query;

        if (rolesError) throw rolesError;

        targetUsers = userRoles?.map(ur => ur.user_id) || [];
        console.log('📧 NotificationSystem: Target users found:', targetUsers.length);
      }

      // Create notifications for all target users
      const notificationsData = targetUsers.map(userId => ({
        institution_id: profile.institution_id,
        user_id: userId,
        title: newNotification.title,
        title_khmer: newNotification.title_khmer || null,
        message: newNotification.message,
        message_khmer: newNotification.message_khmer || null,
        type: newNotification.type,
        expires_at: newNotification.expires_at || null
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notificationsData);

      if (error) throw error;

      console.log('📧 NotificationSystem: Successfully created', notificationsData.length, 'notifications');

      toast({
        title: 'Notification Created',
        description: `Notification has been sent to ${targetUsers.length} user(s)`,
      });

      setNewNotification({
        title: '',
        title_khmer: '',
        message: '',
        message_khmer: '',
        type: 'info',
        target_user_id: targetUserId || '',
        broadcast_to: 'individual',
        expires_at: ''
      });
      setShowForm(false);
      fetchNotifications();
    } catch (error) {
      console.error('📧 NotificationSystem: Error creating notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to create notification',
        variant: 'destructive',
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'error':
        return <X className="h-4 w-4 text-destructive" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          {(showCreateForm || hasRole('coordinator') || hasRole('admin')) && (
            <Button 
              size="sm" 
              onClick={() => setShowForm(!showForm)}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          )}
        </div>
        <CardDescription>
          Stay updated with the latest schedule changes and announcements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">Create New Notification</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Title (English)</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, title: e.target.value
                    }))}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Title (Khmer)</label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 border rounded"
                    value={newNotification.title_khmer}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, title_khmer: e.target.value
                    }))}
                    placeholder="ចំណងជើង"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Message (English)</label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded"
                    rows={3}
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, message: e.target.value
                    }))}
                    placeholder="Notification message"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message (Khmer)</label>
                  <textarea
                    className="w-full mt-1 p-2 border rounded"
                    rows={3}
                    value={newNotification.message_khmer}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, message_khmer: e.target.value
                    }))}
                    placeholder="សារ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, type: e.target.value as any
                    }))}
                  >
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Send To</label>
                  <select
                    className="w-full mt-1 p-2 border rounded"
                    value={newNotification.broadcast_to}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, broadcast_to: e.target.value as any
                    }))}
                  >
                    <option value="individual">Individual User</option>
                    <option value="all_teachers">All Teachers</option>
                    <option value="all_coordinators">All Coordinators</option>
                    <option value="all_users">All Users</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Expires At (Optional)</label>
                  <input
                    type="datetime-local"
                    className="w-full mt-1 p-2 border rounded"
                    value={newNotification.expires_at}
                    onChange={(e) => setNewNotification(prev => ({
                      ...prev, expires_at: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createNotification}>Create Notification</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                  !notification.is_read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getNotificationIcon(notification.type)}
                      <h4 className="font-medium">
                        {notification.title}
                        {notification.title_khmer && (
                          <span className="text-muted-foreground ml-2">
                            ({notification.title_khmer})
                          </span>
                        )}
                      </h4>
                    </div>
                    <p className="text-sm">
                      {notification.message}
                      {notification.message_khmer && (
                        <span className="block text-muted-foreground mt-1">
                          {notification.message_khmer}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                      {notification.expires_at && (
                        <span>Expires: {new Date(notification.expires_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    {!notification.is_read && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;