import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Conflict {
  conflict_type: string;
  description: string;
  entry_ids: string[];
}

interface ConflictDetectionProps {
  scheduleId?: string;
  onConflictsDetected?: (conflicts: Conflict[]) => void;
}

const ConflictDetectionSystem: React.FC<ConflictDetectionProps> = ({ 
  scheduleId, 
  onConflictsDetected 
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(false);
  const [autoDetect, setAutoDetect] = useState(true);

  const detectConflicts = async (targetScheduleId?: string) => {
    if (!profile?.institution_id) return;
    
    setLoading(true);
    try {
      // Get all active schedules if no specific schedule provided
      const scheduleIds = targetScheduleId ? [targetScheduleId] : await getActiveScheduleIds();
      
      const allConflicts: Conflict[] = [];
      
      for (const id of scheduleIds) {
        const { data, error } = await supabase.rpc('detect_schedule_conflicts', {
          schedule_id_param: id
        });

        if (error) throw error;
        
        if (data && data.length > 0) {
          allConflicts.push(...data);
        }
      }

      setConflicts(allConflicts);
      onConflictsDetected?.(allConflicts);

      if (allConflicts.length > 0) {
        toast({
          title: 'Conflicts Detected',
          description: `Found ${allConflicts.length} scheduling conflicts`,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'No Conflicts',
          description: 'Schedule looks good! No conflicts detected.',
        });
      }
    } catch (error) {
      console.error('Error detecting conflicts:', error);
      toast({
        title: 'Error',
        description: 'Failed to detect conflicts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getActiveScheduleIds = async (): Promise<string[]> => {
    const { data, error } = await supabase
      .from('schedules')
      .select('id')
      .eq('institution_id', profile?.institution_id)
      .eq('status', 'published');

    if (error) throw error;
    return data?.map(s => s.id) || [];
  };

  const resolveConflict = async (conflictIndex: number) => {
    const conflict = conflicts[conflictIndex];
    
    try {
      // Create a conflict record for tracking
      const { error } = await supabase
        .from('schedule_conflicts')
        .insert({
          schedule_id: scheduleId || conflicts[0]?.entry_ids[0], // Use first entry's schedule
          conflict_type: conflict.conflict_type,
          description: conflict.description,
          entry_ids: conflict.entry_ids,
          is_resolved: true,
          resolved_by: profile?.user_id,
          resolved_at: new Date().toISOString()
        });

      if (error) throw error;

      // Remove from local state
      const updatedConflicts = conflicts.filter((_, index) => index !== conflictIndex);
      setConflicts(updatedConflicts);

      toast({
        title: 'Conflict Resolved',
        description: 'Conflict has been marked as resolved',
      });
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve conflict',
        variant: 'destructive',
      });
    }
  };

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case 'teacher_double_booking':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'room_double_booking':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'teacher_availability':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConflictTypeIcon = (type: string) => {
    switch (type) {
      case 'teacher_double_booking':
        return <XCircle className="h-4 w-4" />;
      case 'room_double_booking':
        return <AlertTriangle className="h-4 w-4" />;
      case 'teacher_availability':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Auto-detect conflicts when schedule changes
  useEffect(() => {
    if (autoDetect && scheduleId) {
      detectConflicts(scheduleId);
    }
  }, [scheduleId, autoDetect]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning" />
              Conflict Detection System
            </CardTitle>
            <CardDescription>
              Real-time conflict detection for scheduling issues
            </CardDescription>
          </div>
          <Button 
            onClick={() => detectConflicts(scheduleId)} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Scanning...' : 'Scan for Conflicts'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {conflicts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Conflicts Detected</h3>
            <p className="text-muted-foreground">
              Your schedule is looking good! No scheduling conflicts found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-destructive">
                {conflicts.length} Conflict{conflicts.length > 1 ? 's' : ''} Found
              </h4>
              <Badge variant="destructive">{conflicts.length} Issues</Badge>
            </div>
            
            {conflicts.map((conflict, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${getConflictTypeColor(conflict.conflict_type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getConflictTypeIcon(conflict.conflict_type)}
                    <div>
                      <h5 className="font-medium capitalize">
                        {conflict.conflict_type.replace('_', ' ')}
                      </h5>
                      <p className="text-sm mt-1">{conflict.description}</p>
                      <p className="text-xs mt-2 opacity-75">
                        Affected entries: {conflict.entry_ids.length}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveConflict(index)}
                  >
                    Mark Resolved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Auto-detect conflicts</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoDetect(!autoDetect)}
              className={autoDetect ? 'text-success' : 'text-muted-foreground'}
            >
              {autoDetect ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConflictDetectionSystem;