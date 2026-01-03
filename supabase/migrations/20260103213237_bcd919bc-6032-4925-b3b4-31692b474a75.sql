-- Create site_settings table for storing website configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings
CREATE POLICY "Anyone can view site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage site settings"
ON public.site_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default settings
INSERT INTO public.site_settings (key, value) VALUES
  ('logo', '{"url": "", "alt_ar": "سكاي أيقونة", "alt_en": "Sky Icon", "alt_fr": "Sky Icon"}'::jsonb),
  ('contact', '{"phone": "", "email": "", "address_ar": "", "address_en": "", "address_fr": "", "whatsapp": ""}'::jsonb),
  ('social', '{"facebook": "", "instagram": "", "twitter": "", "youtube": "", "tiktok": "", "linkedin": ""}'::jsonb);