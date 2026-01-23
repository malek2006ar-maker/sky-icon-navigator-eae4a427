import '@fontsource/tajawal/300.css';
import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/tajawal/800.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { HeroSlider } from '@/components/HeroSlider';
import { ServicesSection } from '@/components/ServicesSection';
import { ServicePricingSection } from '@/components/ServicePricingSection';
import { YemeniaFlightsSection } from '@/components/YemeniaFlightsSection';
import { PackagesSection } from '@/components/PackagesSection';
import { StatsSection } from '@/components/StatsSection';
import { GallerySection } from '@/components/GallerySection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';
import { FloatingButtons } from '@/components/FloatingButtons';

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSlider />
          <ServicesSection />
          <ServicePricingSection />
          <YemeniaFlightsSection />
          <PackagesSection />
          <StatsSection />
          <GallerySection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </LanguageProvider>
  );
};

export default Index;
