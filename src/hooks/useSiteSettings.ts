import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface LogoSettings {
  url: string;
  alt_ar: string;
  alt_en: string;
  alt_fr: string;
}

interface ContactSettings {
  phone: string;
  phone2?: string;
  phone3?: string;
  phone4?: string;
  admin_phone?: string;
  email: string;
  address_ar: string;
  address_en: string;
  address_fr: string;
  whatsapp: string;
}

interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
}

interface SiteSettings {
  logo: LogoSettings;
  contact: ContactSettings;
  social: SocialSettings;
}

const defaultSettings: SiteSettings = {
  logo: {
    url: '/logo.png',
    alt_ar: 'سكاي أيقونة',
    alt_en: 'Sky Icon',
    alt_fr: 'Sky Icon'
  },
  contact: {
    phone: '+967 783 003 636',
    email: 'info@skyicon.com',
    address_ar: 'اليمن',
    address_en: 'Yemen',
    address_fr: 'Yémen',
    whatsapp: '+967783003636'
  },
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    linkedin: ''
  }
};

export const useSiteSettings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['site-settings-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');
      
      if (error) throw error;
      
      const settings: SiteSettings = { ...defaultSettings };
      
      data?.forEach((setting) => {
        const value = setting.value as Record<string, string>;
        if (setting.key === 'logo' && value.url) {
          settings.logo = value as unknown as LogoSettings;
        } else if (setting.key === 'contact') {
          settings.contact = { ...defaultSettings.contact, ...value as unknown as ContactSettings };
        } else if (setting.key === 'social') {
          settings.social = { ...defaultSettings.social, ...value as unknown as SocialSettings };
        }
      });
      
      return settings;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    settings: data || defaultSettings,
    isLoading
  };
};
