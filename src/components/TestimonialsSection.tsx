import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: isRTL ? 'أحمد محمد' : 'Ahmed Mohamed',
      role: isRTL ? 'حاج من اليمن' : 'Pilgrim from Yemen',
      content: isRTL
        ? 'تجربة رائعة مع سكاي أيكون. كانت رحلة العمرة منظمة بشكل ممتاز والخدمة كانت من الطراز الأول.'
        : 'Amazing experience with Sky Icon. The Umrah trip was excellently organized and the service was first class.',
      rating: 5,
    },
    {
      name: isRTL ? 'فاطمة علي' : 'Fatima Ali',
      role: isRTL ? 'سائحة' : 'Tourist',
      content: isRTL
        ? 'رحلة تايلاند كانت حلم تحقق. فريق سكاي أيكون اهتم بكل التفاصيل وجعل الرحلة لا تُنسى.'
        : 'The Thailand trip was a dream come true. Sky Icon team took care of every detail and made the trip unforgettable.',
      rating: 5,
    },
    {
      name: isRTL ? 'عبدالله سعيد' : 'Abdullah Saeed',
      role: isRTL ? 'رجل أعمال' : 'Businessman',
      content: isRTL
        ? 'أفضل وكالة سفر تعاملت معها. السرعة في إنجاز التأشيرات والدقة في المواعيد. أنصح الجميع بالتعامل معهم.'
        : 'Best travel agency I have dealt with. Speed in visa processing and punctuality. I recommend everyone to work with them.',
      rating: 5,
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-8 h-full shadow-soft hover:shadow-elevated transition-all duration-300">
                {/* Quote icon */}
                <div className="absolute top-6 right-6">
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
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center text-primary font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
