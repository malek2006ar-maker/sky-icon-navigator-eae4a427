import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/admin/ImageUpload';
import { Loader2, Save, Image, Phone, Globe } from 'lucide-react';
import type { Json } from '@/integrations/supabase/types';

interface LogoSettings {
  url: string;
  alt_ar: string;
  alt_en: string;
  alt_fr: string;
}

interface ContactSettings {
  phone: string;
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

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [logo, setLogo] = useState<LogoSettings>({
    url: '',
    alt_ar: 'سكاي أيقونة',
    alt_en: 'Sky Icon',
    alt_fr: 'Sky Icon'
  });
  
  const [contact, setContact] = useState<ContactSettings>({
    phone: '',
    email: '',
    address_ar: '',
    address_en: '',
    address_fr: '',
    whatsapp: ''
  });
  
  const [social, setSocial] = useState<SocialSettings>({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    tiktok: '',
    linkedin: ''
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (settings) {
      settings.forEach((setting) => {
        const value = setting.value as Record<string, string>;
        if (setting.key === 'logo') {
          setLogo(value as unknown as LogoSettings);
        } else if (setting.key === 'contact') {
          setContact(value as unknown as ContactSettings);
        } else if (setting.key === 'social') {
          setSocial(value as unknown as SocialSettings);
        }
      });
    }
  }, [settings]);

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: LogoSettings | ContactSettings | SocialSettings }) => {
      const { error } = await supabase
        .from('site_settings')
        .update({ value: JSON.parse(JSON.stringify(value)) as Json })
        .eq('key', key);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'تم الحفظ',
        description: 'تم حفظ الإعدادات بنجاح'
      });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
        variant: 'destructive'
      });
    }
  });

  const handleLogoUpload = (url: string) => {
    setLogo(prev => ({ ...prev, url }));
  };

  const saveLogo = () => updateSetting.mutate({ key: 'logo', value: logo });
  const saveContact = () => updateSetting.mutate({ key: 'contact', value: contact });
  const saveSocial = () => updateSetting.mutate({ key: 'social', value: social });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
        <p className="text-muted-foreground">إدارة إعدادات الموقع العامة</p>
      </div>

      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            اللوجو
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            التواصل
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            السوشيال ميديا
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>شعار الموقع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>الشعار</Label>
                <ImageUpload
                  value={logo.url}
                  onChange={handleLogoUpload}
                  bucket="gallery"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>النص البديل (عربي)</Label>
                  <Input
                    value={logo.alt_ar}
                    onChange={(e) => setLogo(prev => ({ ...prev, alt_ar: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label>Alt Text (English)</Label>
                  <Input
                    value={logo.alt_en}
                    onChange={(e) => setLogo(prev => ({ ...prev, alt_en: e.target.value }))}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>Texte Alt (Français)</Label>
                  <Input
                    value={logo.alt_fr}
                    onChange={(e) => setLogo(prev => ({ ...prev, alt_fr: e.target.value }))}
                    dir="ltr"
                  />
                </div>
              </div>

              <Button onClick={saveLogo} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                حفظ الشعار
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>رقم الهاتف</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+966 XX XXX XXXX"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>واتساب</Label>
                  <Input
                    value={contact.whatsapp}
                    onChange={(e) => setContact(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+966 XX XXX XXXX"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <Label>البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@example.com"
                  dir="ltr"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>العنوان (عربي)</Label>
                  <Input
                    value={contact.address_ar}
                    onChange={(e) => setContact(prev => ({ ...prev, address_ar: e.target.value }))}
                    dir="rtl"
                  />
                </div>
                <div>
                  <Label>Address (English)</Label>
                  <Input
                    value={contact.address_en}
                    onChange={(e) => setContact(prev => ({ ...prev, address_en: e.target.value }))}
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>Adresse (Français)</Label>
                  <Input
                    value={contact.address_fr}
                    onChange={(e) => setContact(prev => ({ ...prev, address_fr: e.target.value }))}
                    dir="ltr"
                  />
                </div>
              </div>

              <Button onClick={saveContact} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                حفظ معلومات التواصل
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>روابط السوشيال ميديا</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>فيسبوك</Label>
                  <Input
                    value={social.facebook}
                    onChange={(e) => setSocial(prev => ({ ...prev, facebook: e.target.value }))}
                    placeholder="https://facebook.com/..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>إنستغرام</Label>
                  <Input
                    value={social.instagram}
                    onChange={(e) => setSocial(prev => ({ ...prev, instagram: e.target.value }))}
                    placeholder="https://instagram.com/..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>تويتر / X</Label>
                  <Input
                    value={social.twitter}
                    onChange={(e) => setSocial(prev => ({ ...prev, twitter: e.target.value }))}
                    placeholder="https://twitter.com/..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>يوتيوب</Label>
                  <Input
                    value={social.youtube}
                    onChange={(e) => setSocial(prev => ({ ...prev, youtube: e.target.value }))}
                    placeholder="https://youtube.com/..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>تيك توك</Label>
                  <Input
                    value={social.tiktok}
                    onChange={(e) => setSocial(prev => ({ ...prev, tiktok: e.target.value }))}
                    placeholder="https://tiktok.com/..."
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label>لينكد إن</Label>
                  <Input
                    value={social.linkedin}
                    onChange={(e) => setSocial(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="https://linkedin.com/..."
                    dir="ltr"
                  />
                </div>
              </div>

              <Button onClick={saveSocial} disabled={updateSetting.isPending}>
                {updateSetting.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Save className="h-4 w-4 ml-2" />}
                حفظ روابط السوشيال
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
