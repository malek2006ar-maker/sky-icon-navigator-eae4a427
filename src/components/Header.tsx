import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { Menu, X, Phone, UserPlus, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageToggle } from './LanguageToggle';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export const Header = () => {
  const { t, language } = useLanguage();
  const { settings } = useSiteSettings();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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

  const authLabel = language === 'ar' ? 'تسجيل الدخول' : language === 'fr' ? 'Connexion' : 'Sign In';
  const logoutLabel = language === 'ar' ? 'خروج' : language === 'fr' ? 'Déconnexion' : 'Sign Out';

  const handleAuthClick = () => {
    navigate('/auth?tab=signup');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-card/95 backdrop-blur-md shadow-elevated' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img src={logoUrl} alt={logoAlt} className="h-16 sm:h-20 md:h-24 w-auto" />
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
            
            {/* Auth Button */}
            {user ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className={`hidden md:flex items-center gap-2 ${isScrolled ? 'border-border' : 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10'}`}
              >
                <LogOut size={16} />
                <span>{logoutLabel}</span>
              </Button>
            ) : (
              <Button
                onClick={handleAuthClick}
                variant="outline"
                size="sm"
                className={`hidden md:flex items-center gap-2 ${isScrolled ? 'border-border' : 'border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10'}`}
              >
                <UserPlus size={16} />
                <span>{authLabel}</span>
              </Button>
            )}
            
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
              
              {/* Mobile Auth Button */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <LogOut size={18} />
                  {logoutLabel}
                </button>
              ) : (
                <button
                  onClick={handleAuthClick}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-secondary hover:bg-muted transition-colors"
                >
                  <UserPlus size={18} />
                  {authLabel}
                </button>
              )}
              
              <a href={adminPhoneLink} className="flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-secondary-foreground rounded-full font-semibold mt-2">
                <Phone size={16} />
                <span className="ltr-nums">{adminPhone}</span>
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tagline Banner */}
      <div className={`w-full py-2 sm:py-3 transition-all duration-300 ${isScrolled ? 'bg-navy-800' : 'bg-navy-900/90 backdrop-blur-sm'}`}>
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-gold-400 leading-snug">
            سكاي ايكون للسفريات والسياحة وخدمات الحج والعمرة
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gold-300 mt-0.5 sm:mt-1 leading-snug">
            Sky Icon for Travel, Tourism, Hajj &amp; Umrah Services
          </p>
        </div>
      </div>
    </header>
  );
};
