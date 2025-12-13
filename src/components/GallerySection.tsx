import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fallback images
import galleryMeccaHotel from '@/assets/gallery-mecca-hotel.jpg';
import galleryJordan from '@/assets/gallery-jordan.jpg';
import galleryMalaysia from '@/assets/gallery-malaysia.jpg';
import galleryThaiTemple from '@/assets/gallery-thai-temple.jpg';
import galleryMedina from '@/assets/gallery-medina.jpg';
import galleryFlight from '@/assets/gallery-flight.jpg';

interface GalleryItem {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  category: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const fallbackImages = [
  { src: galleryMeccaHotel, category: 'hajj-umrah', alt: 'Luxury hotel with Kaaba view' },
  { src: galleryMedina, category: 'hajj-umrah', alt: 'Pilgrims at Medina' },
  { src: galleryJordan, category: 'tourism', alt: 'Petra Treasury, Jordan' },
  { src: galleryMalaysia, category: 'tourism', alt: 'Petronas Towers, Malaysia' },
  { src: galleryThaiTemple, category: 'tourism', alt: 'Thai Temple at sunset' },
  { src: galleryFlight, category: 'tourism', alt: 'Business class flight' },
];

export const GallerySection = () => {
  const { t, language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: galleryItems } = useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });

  const getTitle = (item: GalleryItem) => {
    switch (language) {
      case 'ar': return item.title_ar;
      case 'fr': return item.title_fr;
      default: return item.title_en;
    }
  };

  const images = galleryItems && galleryItems.length > 0
    ? galleryItems.map(item => ({
        src: item.image_url,
        category: item.category,
        alt: getTitle(item),
      }))
    : fallbackImages;

  return (
    <>
      <section id="gallery" className="py-20 lg:py-32 bg-background" ref={ref}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-header mb-4">{t.gallery.title}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t.gallery.subtitle}
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {images.map((image, index) => (
              <motion.div
                key={image.src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  index === 0 || index === 5 ? 'row-span-2' : ''
                }`}
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover min-h-[200px] group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-50 group-hover:scale-100">
                    <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-primary/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-card/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-card/40 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <motion.img
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
};
