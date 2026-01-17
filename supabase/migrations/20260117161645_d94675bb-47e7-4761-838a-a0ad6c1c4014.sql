-- جدول أسعار الخدمات (الأسعار للمشتركين فقط)
CREATE TABLE public.service_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  tier_name_ar TEXT NOT NULL,
  tier_name_en TEXT NOT NULL,
  tier_name_fr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول رحلات اليمنية للطيران
CREATE TABLE public.yemenia_flights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flight_number TEXT NOT NULL,
  departure_city_ar TEXT NOT NULL,
  departure_city_en TEXT NOT NULL,
  departure_city_fr TEXT NOT NULL,
  arrival_city_ar TEXT NOT NULL,
  arrival_city_en TEXT NOT NULL,
  arrival_city_fr TEXT NOT NULL,
  departure_time TIME NOT NULL,
  arrival_time TIME NOT NULL,
  days_of_week TEXT[] NOT NULL DEFAULT '{}',
  price DECIMAL(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  notes_ar TEXT,
  notes_en TEXT,
  notes_fr TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- جدول الروابط الخارجية
CREATE TABLE public.external_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_fr TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  description_fr TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yemenia_flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_links ENABLE ROW LEVEL SECURITY;

-- سياسات أسعار الخدمات - الأسعار للمشتركين فقط
CREATE POLICY "Anyone can view service pricing info (not price)" ON public.service_pricing
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage service pricing" ON public.service_pricing
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسات رحلات اليمنية
CREATE POLICY "Anyone can view active flights" ON public.yemenia_flights
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage flights" ON public.yemenia_flights
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- سياسات الروابط الخارجية
CREATE POLICY "Anyone can view active links" ON public.external_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage links" ON public.external_links
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- إنشاء view لإخفاء الأسعار عن غير المشتركين
CREATE VIEW public.service_pricing_public 
WITH (security_invoker=on) AS
SELECT 
  id,
  service_id,
  tier_name_ar,
  tier_name_en,
  tier_name_fr,
  description_ar,
  description_en,
  description_fr,
  currency,
  is_active,
  display_order,
  created_at,
  -- الأسعار تظهر فقط للمستخدمين المسجلين
  CASE WHEN auth.uid() IS NOT NULL THEN price ELSE NULL END as price
FROM public.service_pricing
WHERE is_active = true;

-- Triggers للتحديث التلقائي
CREATE TRIGGER update_service_pricing_updated_at
  BEFORE UPDATE ON public.service_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_yemenia_flights_updated_at
  BEFORE UPDATE ON public.yemenia_flights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_links_updated_at
  BEFORE UPDATE ON public.external_links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();