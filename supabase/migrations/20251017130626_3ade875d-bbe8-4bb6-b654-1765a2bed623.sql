-- Enable realtime for teacher schedule updates
-- Ensure complete row data is broadcast for updates/deletes
ALTER TABLE public.schedule_entries REPLICA IDENTITY FULL;

-- Add table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.schedule_entries;