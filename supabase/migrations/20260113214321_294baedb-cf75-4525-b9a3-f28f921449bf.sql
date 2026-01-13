-- Create stats table for dynamic statistics
CREATE TABLE public.stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label_ar TEXT NOT NULL,
  label_en TEXT NOT NULL,
  label_fr TEXT NOT NULL,
  value INTEGER NOT NULL DEFAULT 0,
  icon TEXT NOT NULL DEFAULT 'users',
  suffix_ar TEXT,
  suffix_en TEXT,
  suffix_fr TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access for active stats
CREATE POLICY "Anyone can view active stats"
ON public.stats
FOR SELECT
USING (is_active = true);

-- Admin policies
CREATE POLICY "Admins can manage stats"
ON public.stats
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Create updated_at trigger
CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON public.stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default stats
INSERT INTO public.stats (label_ar, label_en, label_fr, value, icon, suffix_ar, suffix_en, suffix_fr, display_order) VALUES
('عملاء سعداء', 'Happy Clients', 'Clients Satisfaits', 15000, 'users', '+', '+', '+', 1),
('رحلة منظمة', 'Organized Trips', 'Voyages Organisés', 2500, 'plane', '+', '+', '+', 2),
('وجهة سياحية', 'Destinations', 'Destinations', 50, 'globe', '+', '+', '+', 3),
('سنوات خبرة', 'Years Experience', 'Ans d''Expérience', 15, 'award', '+', '+', '+', 4);