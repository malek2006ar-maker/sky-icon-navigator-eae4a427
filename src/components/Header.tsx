import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageToggle } from './LanguageToggle';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Header = () => {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.packages, href: '#packages' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.contact, href: '#contact' }
  ];

  const adminPhone = settings.contact.admin_phone || '+967 777 180 875';
  const adminPhoneLink = `tel:${adminPhone.replace(/\s/g, '')}`;
  const logoUrl = settings.logo.url || '/logo.png';
  const logoAlt = language === 'ar' ? settings.logo.alt_ar : 
                  language === 'fr' ? settings.logo.alt_fr : settings.logo.alt_en;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-card/95 backdrop-blur-md shadow-elevated' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img src={logoUrl} alt={logoAlt} className="h-14 sm:h-16 w-auto" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <a 
                key={item.href} 
                href={item.href} 
                className={`px-4 py-2 rounded-lg font-medium transition-colors link-underline ${isScrolled ? 'text-foreground hover:text-secondary' : 'text-primary-foreground hover:text-secondary'}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <LanguageToggle isScrolled={isScrolled} />
            
            <a href={adminPhoneLink} className="hidden md:flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-full font-semibold hover:bg-secondary/90 transition-colors shadow-gold">
              <Phone size={16} />
              <span className="ltr-nums">{adminPhone}</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className={`lg:hidden p-2 rounded-lg ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }} 
            className="lg:hidden bg-card border-t border-border"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navItems.map(item => (
                <a 
                  key={item.href} 
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <a href={adminPhoneLink} className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold mt-2">
                <Phone size={16} />
                <span className="ltr-nums">{adminPhone}</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
