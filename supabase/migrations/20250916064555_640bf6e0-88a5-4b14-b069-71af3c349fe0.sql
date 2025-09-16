-- Allow coordinators to view profiles in their institution so the teacher picker isn’t empty
-- Safe-guard: drop if it already exists, then create
DROP POLICY IF EXISTS "Coordinators can view all profiles in institution" ON public.profiles;

CREATE POLICY "Coordinators can view all profiles in institution"
ON public.profiles
FOR SELECT
USING (
  (profiles.institution_id = get_user_institution_id(auth.uid()))
  AND has_role(auth.uid(), profiles.institution_id, 'coordinator')
);
