-- Create payment/subscription tracking table
CREATE TABLE IF NOT EXISTS public.payment_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  subscription_active BOOLEAN DEFAULT false,
  subscription_tier TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payment_status ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment status
CREATE POLICY "Admins can view their institution payment status" 
ON public.payment_status 
FOR SELECT 
USING (
  institution_id = get_user_institution_id(auth.uid()) 
  AND has_role(auth.uid(), institution_id, 'admin'::user_role)
);

CREATE POLICY "Service role can manage payment status" 
ON public.payment_status 
FOR ALL 
USING (true);

-- Create conflict detection function
CREATE OR REPLACE FUNCTION public.detect_schedule_conflicts(schedule_id_param UUID)
RETURNS TABLE(
  conflict_type TEXT,
  description TEXT,
  entry_ids UUID[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Teacher double booking conflicts
  RETURN QUERY
  SELECT 
    'teacher_double_booking'::TEXT,
    'Teacher ' || p.first_name || ' ' || p.last_name || ' is double-booked on ' || 
    CASE e1.day_of_week 
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday' 
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
      WHEN 7 THEN 'Sunday'
    END || ' at ' || e1.start_time::TEXT,
    ARRAY[e1.id, e2.id]
  FROM schedule_entries e1
  JOIN schedule_entries e2 ON e1.teacher_id = e2.teacher_id 
    AND e1.day_of_week = e2.day_of_week
    AND e1.id != e2.id
    AND e1.schedule_id = schedule_id_param
    AND e2.schedule_id = schedule_id_param
    AND (
      (e1.start_time, e1.end_time) OVERLAPS (e2.start_time, e2.end_time)
    )
  JOIN profiles p ON p.user_id = e1.teacher_id;

  -- Room double booking conflicts  
  RETURN QUERY
  SELECT 
    'room_double_booking'::TEXT,
    'Room ' || e1.room || ' is double-booked on ' || 
    CASE e1.day_of_week 
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday' 
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
      WHEN 7 THEN 'Sunday'
    END || ' at ' || e1.start_time::TEXT,
    ARRAY[e1.id, e2.id]
  FROM schedule_entries e1
  JOIN schedule_entries e2 ON e1.room = e2.room
    AND e1.day_of_week = e2.day_of_week
    AND e1.id != e2.id
    AND e1.schedule_id = schedule_id_param
    AND e2.schedule_id = schedule_id_param
    AND (
      (e1.start_time, e1.end_time) OVERLAPS (e2.start_time, e2.end_time)
    )
  WHERE e1.room IS NOT NULL AND e1.room != '';

  -- Teacher availability conflicts
  RETURN QUERY
  SELECT 
    'teacher_availability'::TEXT,
    'Teacher ' || p.first_name || ' ' || p.last_name || ' is not available on ' || 
    CASE e.day_of_week 
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday' 
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
      WHEN 7 THEN 'Sunday'
    END || ' at ' || e.start_time::TEXT,
    ARRAY[e.id]
  FROM schedule_entries e
  JOIN profiles p ON p.user_id = e.teacher_id
  WHERE e.schedule_id = schedule_id_param
    AND NOT EXISTS (
      SELECT 1 FROM teacher_availability ta
      WHERE ta.teacher_id = e.teacher_id
        AND ta.day_of_week = e.day_of_week
        AND ta.is_available = true
        AND ta.start_time <= e.start_time
        AND ta.end_time >= e.end_time
    );
END;
$$;

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  title_khmer TEXT,
  message TEXT NOT NULL,
  message_khmer TEXT,
  type TEXT DEFAULT 'info', -- info, warning, success, error
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Coordinators and admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (
  institution_id = get_user_institution_id(auth.uid()) 
  AND (
    has_role(auth.uid(), institution_id, 'coordinator'::user_role) 
    OR has_role(auth.uid(), institution_id, 'admin'::user_role)
  )
);

-- Add trigger to update payment_status updated_at
CREATE TRIGGER update_payment_status_updated_at
BEFORE UPDATE ON public.payment_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();