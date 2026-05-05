-- Restrict automation_settings SELECT to admins only (contains sensitive API tokens)
DROP POLICY IF EXISTS "Anyone can view automation settings" ON public.automation_settings;

CREATE POLICY "Admins can view automation settings"
ON public.automation_settings
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));