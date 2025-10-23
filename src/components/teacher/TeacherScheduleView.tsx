import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Calendar, Clock, MapPin, Wifi, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  notes: string;
  subjects: {
    name: string;
    code: string;
    courses: {
      name: string;
    };
  };
}

const TeacherScheduleView = () => {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [scheduleEntries, setScheduleEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const dayNames = [
    t('schedule.sunday'),
    t('schedule.monday'),
    t('schedule.tuesday'),
    t('schedule.wednesday'),
    t('schedule.thursday'),
    t('schedule.friday'),
    t('schedule.saturday')
  ];

  const fetchSchedule = async () => {
    if (!user || !profile?.institution_id) return;

    try {
      setIsSyncing(true);
      setLoading(true);
      
      // Get the current week's schedule entries for this teacher
      const { data: entries, error } = await supabase
        .from('schedule_entries')
        .select(`
          id,
          day_of_week,
          start_time,
          end_time,
          room,
          notes,
          subjects (
            name,
            code,
            courses (
              name
            )
          )
        `)
        .eq('teacher_id', user.id)
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;

      setScheduleEntries(entries || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast({
        title: t('common.error'),
        description: t('error.loadingFailed'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchSchedule();

    // Set up real-time subscription for schedule changes
    const channel = supabase
      .channel('schedule-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'schedule_entries',
          filter: `teacher_id=eq.${user?.id}`
        },
        () => {
          fetchSchedule();
          toast({ 
            title: t('schedule.updated'), 
            description: t('teacher.lastUpdated') 
          });
        }
      )
      .subscribe();

    // Fallback: periodic refresh in case realtime is unavailable
    const interval = setInterval(fetchSchedule, 30000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [user, profile]);

  const getEntriesForDay = (dayIndex: number) => {
    return scheduleEntries.filter(entry => entry.day_of_week === dayIndex);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className={`flex items-center justify-center py-8 ${language === 'km' ? 'font-khmer' : ''}`}>
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          {t('common.loading')}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`flex items-center gap-2 ${language === 'km' ? 'font-khmer' : ''}`}>
              <Calendar className="h-5 w-5" />
              {t('teacher.mySchedule')}
            </CardTitle>
            <CardDescription className={language === 'km' ? 'font-khmer' : ''}>
              {isSyncing ? (
                <span className="flex items-center gap-2">
                  <Wifi className="h-3 w-3 animate-pulse" />
                  {t('common.syncing')}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  {t('teacher.lastUpdated')}: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={fetchSchedule} disabled={isSyncing} className={language === 'km' ? 'font-khmer' : ''}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => (
            <div key={dayIndex} className="space-y-2">
              <h3 className="font-medium text-sm text-center pb-2 border-b">
                {dayNames[dayIndex]}
              </h3>
              <div className="space-y-2 min-h-[200px]">
                {getEntriesForDay(dayIndex).length > 0 ? (
                  getEntriesForDay(dayIndex).map((entry) => (
                    <div key={entry.id} className="p-3 bg-primary/10 rounded-lg border text-sm">
                      <div className="font-medium text-primary">
                        {entry.subjects?.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {entry.subjects?.courses?.name}
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {entry.start_time} - {entry.end_time}
                      </div>
                      {entry.room && (
                        <div className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${language === 'km' ? 'font-khmer' : ''}`}>
                          <MapPin className="h-3 w-3" />
                          {t('schedule.room')}: {entry.room}
                        </div>
                      )}
                      {entry.notes && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={`text-center text-muted-foreground text-xs mt-8 ${language === 'km' ? 'font-khmer' : ''}`}>
                    {t('schedule.noEntries')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {scheduleEntries.length === 0 && (
          <div className={`text-center py-8 ${language === 'km' ? 'font-khmer' : ''}`}>
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('teacher.noSchedule')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'en' 
                ? 'Contact your coordinator to set up your teaching schedule'
                : 'សូមទាក់ទងអ្នកសម្របសម្រួលរបស់អ្នក ដើម្បីរៀបចំកាលវិភាគបង្រៀនរបស់អ្នក'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherScheduleView;