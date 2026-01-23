import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plane, Clock, Calendar, Loader2 } from 'lucide-react';

export const YemeniaFlightsSection = () => {
  const { language, isRTL } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const { data: flights, isLoading } = useQuery({
    queryKey: ['yemenia-flights-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('yemenia_flights')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  const content = {
    ar: {
      title: 'رحلات الخطوط الجوية اليمنية',
      subtitle: 'احجز رحلتك مع الخطوط الجوية اليمنية',
      departure: 'المغادرة',
      arrival: 'الوصول',
      days: 'أيام التشغيل',
      flightNo: 'رقم الرحلة',
      noFlights: 'لا توجد رحلات متاحة حالياً',
      daysMap: {
        'sunday': 'الأحد',
        'monday': 'الاثنين',
        'tuesday': 'الثلاثاء',
        'wednesday': 'الأربعاء',
        'thursday': 'الخميس',
        'friday': 'الجمعة',
        'saturday': 'السبت',
      }
    },
    en: {
      title: 'Yemenia Airways Flights',
      subtitle: 'Book your flight with Yemenia Airways',
      departure: 'Departure',
      arrival: 'Arrival',
      days: 'Operating Days',
      flightNo: 'Flight No.',
      noFlights: 'No flights available',
      daysMap: {
        'sunday': 'Sun',
        'monday': 'Mon',
        'tuesday': 'Tue',
        'wednesday': 'Wed',
        'thursday': 'Thu',
        'friday': 'Fri',
        'saturday': 'Sat',
      }
    },
    fr: {
      title: 'Vols Yemenia Airways',
      subtitle: 'Réservez votre vol avec Yemenia Airways',
      departure: 'Départ',
      arrival: 'Arrivée',
      days: 'Jours d\'opération',
      flightNo: 'N° Vol',
      noFlights: 'Aucun vol disponible',
      daysMap: {
        'sunday': 'Dim',
        'monday': 'Lun',
        'tuesday': 'Mar',
        'wednesday': 'Mer',
        'thursday': 'Jeu',
        'friday': 'Ven',
        'saturday': 'Sam',
      }
    },
  };

  const t = content[language];

  const getLocalizedField = (item: any, field: string) => {
    const key = `${field}_${language}`;
    return item[key] || item[`${field}_en`] || '';
  };

  const formatTime = (time: string) => {
    return time?.slice(0, 5) || '';
  };

  const translateDays = (days: string[]) => {
    return days.map(day => t.daysMap[day.toLowerCase() as keyof typeof t.daysMap] || day).join(' • ');
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (!flights || flights.length === 0) {
    return null;
  }

  return (
    <section id="flights" className="py-20 lg:py-32 bg-gradient-to-b from-navy-900 to-navy-800" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className={`text-center mb-16 ${isRTL ? 'font-tajawal' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Plane className="w-8 h-8 text-gold-400" />
            <h2 className="text-3xl md:text-4xl font-bold text-white font-playfair">{t.title}</h2>
          </div>
          <p className="text-gold-300 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Flights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flights.map((flight, index) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-gold-400/50 transition-all duration-300 group">
                {/* Flight Number Header */}
                <div className="bg-gold-500/20 px-6 py-3 flex items-center justify-between">
                  <span className="text-gold-400 font-bold text-lg">
                    {t.flightNo} {flight.flight_number}
                  </span>
                  <Plane className="w-5 h-5 text-gold-400 group-hover:translate-x-2 transition-transform" />
                </div>

                {/* Route */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    {/* Departure */}
                    <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
                      <p className="text-white/60 text-sm mb-1">{t.departure}</p>
                      <p className="text-white font-bold text-lg">
                        {getLocalizedField(flight, 'departure_city')}
                      </p>
                      <p className="text-gold-400 font-mono text-xl mt-1">
                        {formatTime(flight.departure_time)}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-1 px-4">
                      <div className="relative">
                        <div className="border-t-2 border-dashed border-white/30 w-full"></div>
                        <Plane className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 text-gold-400 ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className={`text-center ${isRTL ? 'text-left' : 'text-right'}`}>
                      <p className="text-white/60 text-sm mb-1">{t.arrival}</p>
                      <p className="text-white font-bold text-lg">
                        {getLocalizedField(flight, 'arrival_city')}
                      </p>
                      <p className="text-gold-400 font-mono text-xl mt-1">
                        {formatTime(flight.arrival_time)}
                      </p>
                    </div>
                  </div>

                  {/* Days */}
                  <div className="flex items-center gap-2 text-white/70 text-sm bg-white/5 rounded-lg px-4 py-3">
                    <Calendar className="w-4 h-4 text-gold-400" />
                    <span>{t.days}:</span>
                    <span className="text-white font-medium">
                      {translateDays(flight.days_of_week || [])}
                    </span>
                  </div>

                  {/* Notes */}
                  {flight.notes_ar && (
                    <p className="text-white/60 text-sm mt-4 italic">
                      {getLocalizedField(flight, 'notes')}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};