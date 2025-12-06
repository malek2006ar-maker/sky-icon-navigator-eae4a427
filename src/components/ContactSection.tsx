import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

export const ContactSection = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: isRTL ? 'تم الإرسال بنجاح!' : 'Message Sent!',
      description: isRTL ? 'سنتواصل معك قريباً' : 'We will contact you soon',
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: t.contact.address,
      value: t.contact.addressValue,
    },
    {
      icon: Phone,
      label: isRTL ? 'الهاتف' : 'Phone',
      value: '+967 783 003 636',
      link: 'tel:+967783003636',
    },
    {
      icon: Mail,
      label: isRTL ? 'البريد الإلكتروني' : 'Email',
      value: 'info@skyicon.com',
      link: 'mailto:info@skyicon.com',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+967 783 003 636',
      link: 'https://wa.me/967783003636',
    },
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-header mb-4">{t.contact.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.name}
                  </label>
                  <Input
                    type="text"
                    required
                    className="bg-card border-border focus:border-secondary focus:ring-secondary"
                    placeholder={isRTL ? 'أدخل اسمك' : 'Enter your name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.contact.email}
                  </label>
                  <Input
                    type="email"
                    required
                    className="bg-card border-border focus:border-secondary focus:ring-secondary"
                    placeholder={isRTL ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.contact.phone}
                </label>
                <Input
                  type="tel"
                  className="bg-card border-border focus:border-secondary focus:ring-secondary ltr-nums"
                  placeholder={isRTL ? 'أدخل رقم هاتفك' : 'Enter your phone'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.contact.message}
                </label>
                <Textarea
                  required
                  rows={5}
                  className="bg-card border-border focus:border-secondary focus:ring-secondary resize-none"
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 py-6 text-lg font-semibold rounded-xl shadow-gold"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                    {isRTL ? 'جاري الإرسال...' : 'Sending...'}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={20} />
                    {t.contact.send}
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                {item.link ? (
                  <a
                    href={item.link}
                    target={item.link.startsWith('http') ? '_blank' : undefined}
                    rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300 group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{item.label}</h4>
                      <p className="text-muted-foreground ltr-nums">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-start gap-4 p-6 bg-card rounded-2xl shadow-soft">
                    <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center shrink-0">
                      <item.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{item.label}</h4>
                      <p className="text-muted-foreground">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Additional contact numbers */}
            <div className="bg-muted rounded-2xl p-6">
              <h4 className="font-bold text-foreground mb-4">
                {isRTL ? 'أرقام إضافية' : 'Additional Numbers'}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {['783003838', '783003939', '101127338'].map((num) => (
                  <a
                    key={num}
                    href={`tel:+967${num}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-secondary transition-colors ltr-nums"
                  >
                    <Phone size={16} />
                    {num}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
