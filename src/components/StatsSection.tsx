import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, Plane, Globe, Award } from 'lucide-react';

export const StatsSection = () => {
  const { t } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { icon: Users, value: 15000, suffix: '+', label: t.stats.clients },
    { icon: Plane, value: 5000, suffix: '+', label: t.stats.trips },
    { icon: Globe, value: 25, suffix: '+', label: t.stats.countries },
    { icon: Award, value: 12, suffix: '', label: t.stats.years },
  ];

  return (
    <section className="py-20 bg-gradient-navy relative overflow-hidden" ref={ref}>
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-overlay opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-secondary" />
              </div>
              <div className="text-4xl md:text-5xl font-bold text-primary-foreground mb-2 font-playfair">
                <Counter value={stat.value} isInView={isInView} />
                {stat.suffix}
              </div>
              <div className="text-primary-foreground/80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Counter = ({ value, isInView }: { value: number; isInView: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span className="ltr-nums">{count.toLocaleString()}</span>;
};
