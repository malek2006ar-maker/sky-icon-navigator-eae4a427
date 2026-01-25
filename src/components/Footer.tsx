import { useLanguage } from '@/contexts/LanguageContext';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Send } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const Footer = () => {
  const { t, language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();

  const socialLinks = [
    { icon: Facebook, href: settings.social.facebook, label: 'Facebook' },
    { icon: Instagram, href: settings.social.instagram, label: 'Instagram' },
    { icon: Twitter, href: settings.social.twitter, label: 'Twitter' },
    { icon: Youtube, href: settings.social.youtube, label: 'YouTube' },
    { icon: Linkedin, href: settings.social.linkedin, label: 'LinkedIn' },
    { icon: Send, href: settings.social.tiktok, label: 'TikTok' },
  ].filter(link => link.href);

  const quickLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.packages, href: '#packages' },
    { label: t.nav.gallery, href: '#gallery' },
    { label: t.nav.testimonials, href: '#testimonials' },
    { label: t.nav.contact, href: '#contact' }
  ];

  const logoUrl = settings.logo.url || '/lovable-uploads/781b01c2-0fdc-4126-b90c-c4eb70d1a4cb.png';
  const address = language === 'ar' ? settings.contact.address_ar : 
                  language === 'fr' ? settings.contact.address_fr : settings.contact.address_en;

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <img 
                alt={language === 'ar' ? settings.logo.alt_ar : settings.logo.alt_en} 
                className="h-20 w-auto brightness-0 invert" 
                src={logoUrl} 
              />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed max-w-md mb-6">
              {t.footer.about}
            </p>
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(social => (
                  <a 
                    key={social.label} 
                    href={social.href} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label} 
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-colors"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6 font-playfair">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} className="text-primary-foreground/80 hover:text-secondary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-6 font-playfair">{t.footer.contactInfo}</h4>
            <ul className="space-y-4 text-primary-foreground/80 text-end">
              {/* Office Phones */}
              {(settings.contact.phone || settings.contact.phone2 || settings.contact.phone3 || settings.contact.phone4) && (
                <li className="ltr-nums">
                  <strong className="block text-primary-foreground mb-1">
                    {isRTL ? 'أرقام المكتب:' : 'Office Phones:'}
                  </strong>
                  <div className="space-y-1">
                    {settings.contact.phone && <div>{settings.contact.phone}</div>}
                    {settings.contact.phone2 && <div>{settings.contact.phone2}</div>}
                    {settings.contact.phone3 && <div>{settings.contact.phone3}</div>}
                    {settings.contact.phone4 && <div>{settings.contact.phone4}</div>}
                  </div>
                </li>
              )}
              {/* Admin Phone */}
              {settings.contact.admin_phone && (
                <li className="ltr-nums">
                  <strong className="block text-primary-foreground mb-1">
                    {isRTL ? 'جوال المدير:' : 'Admin Phone:'}
                  </strong>
                  {settings.contact.admin_phone}
                </li>
              )}
              {/* WhatsApp */}
              {settings.contact.whatsapp && (
                <li className="ltr-nums" dir="ltr">
                  <strong className="block text-primary-foreground mb-1" dir={isRTL ? 'rtl' : 'ltr'}>
                    {isRTL ? 'واتساب:' : 'WhatsApp:'}
                  </strong>
                  <span dir="ltr">{settings.contact.whatsapp}</span>
                </li>
              )}
              {settings.contact.email && (
                <li className="text-end">
                  <strong className="block text-primary-foreground mb-1">
                    {isRTL ? 'البريد:' : 'Email:'}
                  </strong>
                  {settings.contact.email}
                </li>
              )}
              {address && (
                <li>
                  <strong className="block text-primary-foreground mb-1">
                    {t.contact.address}:
                  </strong>
                  {address || t.contact.addressValue}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-start">
            <p className="text-primary-foreground/60 text-sm">
              © {new Date().getFullYear()} Sky Icon. {t.footer.rights}
            </p>
            <p className="text-primary-foreground/60 text-sm">
              {isRTL ? 'صُنع بـ ❤️ في اليمن' : 'Made with ❤️ in Yemen'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
