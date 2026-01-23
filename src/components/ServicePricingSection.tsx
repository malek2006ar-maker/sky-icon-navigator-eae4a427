import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Lock, DollarSign, Loader2, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

export const ServicePricingSection = () => {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Fetch services
  const { data: services } = useQuery({
    queryKey: ['services-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
  });

  // Fetch pricing - will only show prices to authenticated users due to RLS
  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['service-pricing-public', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_pricing')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const content = {
    ar: {
      title: 'أسعار خدماتنا',
      subtitle: 'تعرف على أسعار جميع خدماتنا المميزة',
      loginPrompt: 'سجل الدخول للاطلاع على الأسعار',
      loginButton: 'تسجيل الدخول',
      signupButton: 'إنشاء حساب مجاني',
      currency: 'دولار',
      noPrice: 'تواصل معنا',
    },
    en: {
      title: 'Our Service Prices',
      subtitle: 'Discover our competitive service pricing',
      loginPrompt: 'Sign in to view prices',
      loginButton: 'Sign In',
      signupButton: 'Create Free Account',
      currency: 'USD',
      noPrice: 'Contact Us',
    },
    fr: {
      title: 'Nos Tarifs',
      subtitle: 'Découvrez nos prix compétitifs',
      loginPrompt: 'Connectez-vous pour voir les prix',
      loginButton: 'Connexion',
      signupButton: 'Créer un compte gratuit',
      currency: 'USD',
      noPrice: 'Contactez-nous',
    },
  };

  const t = content[language];

  const getLocalizedField = (item: any, field: string) => {
    const key = `${field}_${language}`;
    return item[key] || item[`${field}_en`] || '';
  };

  // Group pricing by service
  const getPricingForService = (serviceId: string) => {
    if (!pricing) return [];
    return pricing.filter(p => p.service_id === serviceId);
  };

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className={`text-center mb-16 ${isRTL ? 'font-tajawal' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-header mb-4">{t.title}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Not logged in - Show prompt */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-card rounded-2xl p-8 shadow-elevated border border-border text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-playfair">
                {t.loginPrompt}
              </h3>
              <p className="text-muted-foreground mb-6">
                {language === 'ar' 
                  ? 'أنشئ حساباً مجانياً للوصول إلى أسعار جميع خدماتنا والعروض الحصرية'
                  : language === 'fr'
                  ? 'Créez un compte gratuit pour accéder à tous nos prix et offres exclusives'
                  : 'Create a free account to access all our prices and exclusive offers'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate('/auth?tab=signup')}
                  className="gap-2"
                  size="lg"
                >
                  <UserPlus className="w-5 h-5" />
                  {t.signupButton}
                </Button>
                <Button
                  onClick={() => navigate('/auth?tab=signin')}
                  variant="outline"
                  size="lg"
                >
                  {t.loginButton}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Logged in - Show pricing */}
        {user && (
          <>
            {pricingLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services?.map((service, index) => {
                  const servicePricing = getPricingForService(service.id);
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 border border-border/50 h-full">
                        {/* Service Header */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 p-6">
                          <h3 className="text-xl font-bold text-primary-foreground font-playfair">
                            {getLocalizedField(service, 'title')}
                          </h3>
                          <p className="text-primary-foreground/80 text-sm mt-1">
                            {getLocalizedField(service, 'description')}
                          </p>
                        </div>
                        
                        {/* Pricing Tiers */}
                        <div className="p-6 space-y-4">
                          {servicePricing.length > 0 ? (
                            servicePricing.map((tier) => (
                              <div 
                                key={tier.id} 
                                className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                              >
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {getLocalizedField(tier, 'tier_name')}
                                  </p>
                                  {tier.description_ar && (
                                    <p className="text-sm text-muted-foreground">
                                      {getLocalizedField(tier, 'description')}
                                    </p>
                                  )}
                                </div>
                                <div className="text-end">
                                  <p className="text-2xl font-bold text-secondary">
                                    {tier.price}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {tier.currency}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              <DollarSign className="w-8 h-8 mx-auto mb-2 opacity-50" />
                              <p>{t.noPrice}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};