import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useState } from 'react';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingDialog } from '@/components/BookingDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/useSiteSettings';

// Fallback images
import heroHajj from '@/assets/hero-hajj.jpg';
import heroThailand from '@/assets/hero-thailand.jpg';
import galleryMalaysia from '@/assets/gallery-malaysia.jpg';
import galleryJordan from '@/assets/gallery-jordan.jpg';

interface PackageItem {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  price: string;
  duration_ar: string;
  duration_en: string;
  duration_fr: string;
  image_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export const PackagesSection = () => {
  const { t, language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: packagesData } = useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as PackageItem[];
    },
  });

  const getLocalizedText = (item: PackageItem, field: 'title' | 'description' | 'duration') => {
    const arField = `${field}_ar` as keyof PackageItem;
    const enField = `${field}_en` as keyof PackageItem;
    const frField = `${field}_fr` as keyof PackageItem;
    
    switch (language) {
      case 'ar': return item[arField] as string;
      case 'fr': return item[frField] as string;
      default: return item[enField] as string;
    }
  };

  // Fallback packages
  const fallbackPackages = [
    {
      image: heroHajj,
      title: t.packages.ramadanUmrah.title,
      description: t.packages.ramadanUmrah.description,
      duration: t.packages.ramadanUmrah.duration,
      price: '$2,500',
      featured: true,
    },
    {
      image: heroThailand,
      title: t.packages.thailand.title,
      description: t.packages.thailand.description,
      duration: t.packages.thailand.duration,
      price: '$1,200',
      featured: false,
    },
    {
      image: galleryMalaysia,
      title: t.packages.malaysia.title,
      description: t.packages.malaysia.description,
      duration: t.packages.malaysia.duration,
      price: '$1,500',
      featured: false,
    },
    {
      image: galleryJordan,
      title: t.packages.jordan.title,
      description: t.packages.jordan.description,
      duration: t.packages.jordan.duration,
      price: '$900',
      featured: false,
    },
  ];

  const packages = packagesData && packagesData.length > 0
    ? packagesData.map(item => ({
        id: item.id,
        image: item.image_url,
        title: getLocalizedText(item, 'title'),
        description: getLocalizedText(item, 'description') || '',
        duration: getLocalizedText(item, 'duration'),
        price: item.price,
        featured: item.is_featured,
      }))
    : fallbackPackages;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<{ title: string; price: string }>({ title: '', price: '' });

  const handleBookNow = (packageTitle: string, packagePrice: string) => {
    setSelectedPkg({ title: packageTitle, price: packagePrice });
    setBookingOpen(true);
  };

  return (
    <section id="packages" className="py-20 lg:py-32 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className={`text-center mb-16`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-header mb-4">{t.packages.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.packages.subtitle}
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={`relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 ${pkg.featured ? 'ring-2 ring-secondary' : ''}`}>
                {/* Featured Badge */}
                {pkg.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {isRTL ? 'مميز' : 'Featured'}
                  </div>
                )}

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-40" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-foreground mb-2 font-playfair">
                    {pkg.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{pkg.duration}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground block">{t.packages.from}</span>
                      <span className="text-2xl font-bold text-secondary ltr-nums">{pkg.price}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleBookNow(pkg.title, pkg.price)}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                    >
                      {t.packages.bookNow}
                      {isRTL ? <ArrowLeft size={14} className="ms-1" /> : <ArrowRight size={14} className="ms-1" />}
                    </Button>
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