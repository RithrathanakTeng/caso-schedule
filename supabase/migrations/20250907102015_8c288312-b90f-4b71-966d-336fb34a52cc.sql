-- Fix security warnings: Set search_path for the conflict detection function
CREATE OR REPLACE FUNCTION public.detect_schedule_conflicts(schedule_id_param UUID)
RETURNS TABLE(
  conflict_type TEXT,
  description TEXT,
  entry_ids UUID[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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