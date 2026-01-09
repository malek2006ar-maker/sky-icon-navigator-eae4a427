import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Testimonial {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  role_ar: string;
  role_en: string;
  role_fr: string;
  content_ar: string;
  content_en: string;
  content_fr: string;
  rating: number;
  avatar_url: string | null;
}

export const TestimonialsSection = () => {
  const { t, language, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const getLocalizedField = (item: Testimonial, field: 'name' | 'role' | 'content') => {
    const key = `${field}_${language}` as keyof Testimonial;
    return item[key] as string || item[`${field}_ar` as keyof Testimonial] as string;
  };

  // Fallback testimonials when database is empty
  const fallbackTestimonials = [
    {
      id: '1',
      name_ar: 'أحمد محمد',
      name_en: 'Ahmed Mohamed',
      name_fr: 'Ahmed Mohamed',
      role_ar: 'حاج من اليمن',
      role_en: 'Pilgrim from Yemen',
      role_fr: 'Pèlerin du Yémen',
      content_ar: 'تجربة رائعة مع سكاي أيكون. كانت رحلة العمرة منظمة بشكل ممتاز والخدمة كانت من الطراز الأول.',
      content_en: 'Amazing experience with Sky Icon. The Umrah trip was excellently organized and the service was first class.',
      content_fr: 'Expérience incroyable avec Sky Icon. Le voyage Omra était excellemment organisé.',
      rating: 5,
      avatar_url: null,
    },
    {
      id: '2',
      name_ar: 'فاطمة علي',
      name_en: 'Fatima Ali',
      name_fr: 'Fatima Ali',
      role_ar: 'سائحة',
      role_en: 'Tourist',
      role_fr: 'Touriste',
      content_ar: 'رحلة تايلاند كانت حلم تحقق. فريق سكاي أيكون اهتم بكل التفاصيل وجعل الرحلة لا تُنسى.',
      content_en: 'The Thailand trip was a dream come true. Sky Icon team took care of every detail.',
      content_fr: 'Le voyage en Thaïlande était un rêve devenu réalité.',
      rating: 5,
      avatar_url: null,
    },
    {
      id: '3',
      name_ar: 'عبدالله سعيد',
      name_en: 'Abdullah Saeed',
      name_fr: 'Abdullah Saeed',
      role_ar: 'رجل أعمال',
      role_en: 'Businessman',
      role_fr: 'Homme d\'affaires',
      content_ar: 'أفضل وكالة سفر تعاملت معها. السرعة في إنجاز التأشيرات والدقة في المواعيد.',
      content_en: 'Best travel agency I have dealt with. Speed in visa processing and punctuality.',
      content_fr: 'La meilleure agence de voyage avec laquelle j\'ai travaillé.',
      rating: 5,
      avatar_url: null,
    },
  ];

  const displayTestimonials = testimonials && testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-muted pattern-overlay" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-header mb-4">{t.testimonials.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.testimonials.subtitle}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl p-8">
                <Skeleton className="h-5 w-24 mb-4" />
                <Skeleton className="h-20 w-full mb-6" />
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {displayTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative bg-card rounded-2xl p-8 h-full shadow-soft hover:shadow-elevated transition-all duration-300">
                  {/* Quote icon */}
                  <div className={`absolute top-6 ${isRTL ? 'right-6' : 'left-6'}`}>
                    <Quote className="w-10 h-10 text-secondary/30" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-foreground leading-relaxed mb-6">
                    "{getLocalizedField(testimonial, 'content')}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary font-bold">
                      {getLocalizedField(testimonial, 'name').charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{getLocalizedField(testimonial, 'name')}</h4>
                      <p className="text-sm text-muted-foreground">{getLocalizedField(testimonial, 'role')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
