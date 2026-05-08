import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// Fallback images
import heroHajj from '@/assets/hero-hajj.jpg';
import heroThailand from '@/assets/hero-thailand.jpg';
import heroUmrah from '@/assets/hero-umrah.jpg';

interface Slider {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  image_url: string;
  button_text_ar: string | null;
  button_text_en: string | null;
  button_text_fr: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
}

export const HeroSlider = () => {
  const { t, language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: slidersData } = useQuery({
    queryKey: ['sliders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sliders')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Slider[];
    },
  });

  // Fallback slides
  const fallbackSlides = [
    {
      image: heroHajj,
      title: t.hero.slide1.title,
      subtitle: t.hero.slide1.subtitle,
      cta: t.hero.slide1.cta,
      link: '#packages',
    },
    {
      image: heroUmrah,
      title: t.hero.slide2.title,
      subtitle: t.hero.slide2.subtitle,
      cta: t.hero.slide2.cta,
      link: '#packages',
    },
    {
      image: heroThailand,
      title: t.hero.slide3.title,
      subtitle: t.hero.slide3.subtitle,
      cta: t.hero.slide3.cta,
      link: '#packages',
    },
  ];

  const getLocalizedText = (item: Slider, field: 'title' | 'subtitle' | 'button_text') => {
    const arField = `${field}_ar` as keyof Slider;
    const enField = `${field}_en` as keyof Slider;
    const frField = `${field}_fr` as keyof Slider;
    
    switch (language) {
      case 'ar': return item[arField] as string;
      case 'fr': return item[frField] as string;
      default: return item[enField] as string;
    }
  };

  const slides = slidersData && slidersData.length > 0
    ? slidersData.map(item => ({
        image: item.image_url,
        title: getLocalizedText(item, 'title'),
        subtitle: getLocalizedText(item, 'subtitle') || '',
        cta: getLocalizedText(item, 'button_text') || (isRTL ? 'احجز الآن' : 'Book Now'),
        link: item.button_link || '#packages',
      }))
    : fallbackSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  // Reset slide index if slides change
  useEffect(() => {
    if (currentSlide >= slides.length) {
      setCurrentSlide(0);
    }
  }, [slides.length, currentSlide]);

  const whatsappNumber = settings.contact.whatsapp?.replace(/\D/g, '') || '967783003636';

  const handleCTAClick = (link: string) => {
    if (link.startsWith('#')) {
      document.querySelector(link)?.scrollIntoView({ behavior: 'smooth' });
    } else if (link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      // Default to WhatsApp
      const message = encodeURIComponent(isRTL ? 'مرحباً، أود الاستفسار عن خدماتكم' : 'Hello, I would like to inquire about your services');
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    }
  };

  return (
    <section id="home" className="relative min-h-[480px] sm:min-h-[560px] h-[85vh] sm:h-screen overflow-hidden">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-hero" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`max-w-3xl ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <motion.h2
                className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight"
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {slides[currentSlide].title}
              </motion.h2>
              <motion.p
                className="text-base sm:text-xl md:text-2xl text-primary-foreground/90 mb-6 sm:mb-8"
                initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={() => handleCTAClick(slides[currentSlide].link)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 text-lg px-8 py-6 rounded-full font-semibold shadow-gold pulse-glow"
                >
                  {slides[currentSlide].cta}
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRTL ? 'right-4 md:right-8' : 'left-4 md:left-8'
        } z-20 w-12 h-12 rounded-full bg-card/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/50 transition-colors`}
      >
        {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 -translate-y-1/2 ${
          isRTL ? 'left-4 md:left-8' : 'right-4 md:right-8'
        } z-20 w-12 h-12 rounded-full bg-card/30 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/50 transition-colors`}
      >
        {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-secondary w-8'
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
        style={{ marginLeft: '150px' }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary-foreground/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};