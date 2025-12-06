import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Plane, Hotel, Globe, MapPin, Compass, MessageCircle } from 'lucide-react';

export const ServicesSection = () => {
  const { t, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      icon: Compass,
      title: t.services.hajjUmrah.title,
      description: t.services.hajjUmrah.description,
      color: 'from-gold to-gold-light',
    },
    {
      icon: Globe,
      title: t.services.visas.title,
      description: t.services.visas.description,
      color: 'from-navy to-navy-light',
    },
    {
      icon: Plane,
      title: t.services.flights.title,
      description: t.services.flights.description,
      color: 'from-gold-dark to-gold',
    },
    {
      icon: Hotel,
      title: t.services.hotels.title,
      description: t.services.hotels.description,
      color: 'from-navy-light to-navy',
    },
    {
      icon: MapPin,
      title: t.services.tours.title,
      description: t.services.tours.description,
      color: 'from-gold to-gold-dark',
    },
    {
      icon: MessageCircle,
      title: t.services.consulting.title,
      description: t.services.consulting.description,
      color: 'from-navy to-navy-dark',
    },
  ];

  return (
    <section id="services" className="py-20 lg:py-32 bg-background pattern-overlay" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className={`text-center mb-16 ${isRTL ? 'font-tajawal' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-header mb-4">{t.services.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-card rounded-2xl p-8 h-full shadow-soft hover:shadow-elevated transition-all duration-300 border border-border/50 overflow-hidden">
                {/* Background decoration */}
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-gradient-to-br ${service.color} opacity-5 rounded-full -translate-y-1/2 ${isRTL ? '-translate-x-1/2' : 'translate-x-1/2'} group-hover:opacity-10 transition-opacity`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-foreground mb-3 font-playfair">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Hover line */}
                <div className={`absolute bottom-0 ${isRTL ? 'right-0' : 'left-0'} h-1 bg-gradient-to-r ${service.color} w-0 group-hover:w-full transition-all duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
