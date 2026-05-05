import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle,
  Settings2,
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
  PlayCircle
} from 'lucide-react';

interface AutomationSetting {
  id: string;
  platform: string;
  is_enabled: boolean;
  config: Record<string, string>;
  created_at: string;
  updated_at: string;
}

interface AutomationLog {
  id: string;
  platform: string;
  content_type: string;
  content_id: string;
  status: string;
  response: Record<string, any> | null;
  error_message: string | null;
  created_at: string;
}

const platformConfig = [
  {
    id: 'telegram',
    name: 'تيليغرام',
    icon: Send,
    description: 'نشر في قناة أو مجموعة تيليغرام',
    fields: [
      { key: 'bot_token', label: 'Bot Token', placeholder: 'أدخل توكن البوت من @BotFather', type: 'password' },
      { key: 'chat_id', label: 'Chat ID', placeholder: 'أدخل معرف القناة أو المجموعة (مثل: @channelname أو -100123456789)', type: 'text' }
    ],
    color: 'bg-blue-500'
  },
  {
    id: 'whatsapp',
    name: 'واتساب بيزنس',
    icon: MessageCircle,
    description: 'نشر عبر WhatsApp Business API',
    fields: [
      { key: 'phone_number_id', label: 'Phone Number ID', placeholder: 'معرف رقم الهاتف', type: 'text' },
      { key: 'access_token', label: 'Access Token', placeholder: 'توكن الوصول من Meta', type: 'password' }
    ],
    color: 'bg-green-500'
  },
  {
    id: 'facebook',
    name: 'فيسبوك',
    icon: Facebook,
    description: 'نشر في صفحة فيسبوك',
    fields: [
      { key: 'page_id', label: 'Page ID', placeholder: 'معرف الصفحة', type: 'text' },
      { key: 'access_token', label: 'Access Token', placeholder: 'توكن الوصول للصفحة', type: 'password' }
    ],
    color: 'bg-blue-600'
  },
  {
    id: 'instagram',
    name: 'انستغرام',
    icon: Instagram,
    description: 'نشر في حساب انستغرام بيزنس',
    fields: [
      { key: 'account_id', label: 'Account ID', placeholder: 'معرف الحساب', type: 'text' },
      { key: 'access_token', label: 'Access Token', placeholder: 'توكن الوصول', type: 'password' }
    ],
    color: 'bg-gradient-to-r from-purple-500 to-pink-500'
  },
  {
    id: 'twitter',
    name: 'تويتر/X',
    icon: Twitter,
    description: 'نشر تغريدات تلقائياً',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'مفتاح API', type: 'password' },
      { key: 'api_secret', label: 'API Secret', placeholder: 'سر API', type: 'password' },
      { key: 'access_token', label: 'Access Token', placeholder: 'توكن الوصول', type: 'password' },
      { key: 'access_secret', label: 'Access Secret', placeholder: 'سر الوصول', type: 'password' }
    ],
    color: 'bg-black'
  }
];

const Automation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [configs, setConfigs] = useState<Record<string, Record<string, string>>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [testingAll, setTestingAll] = useState(false);
  const [testingPlatform, setTestingPlatform] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['automation-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_settings')
        .select('*');
      if (error) throw error;
      
      const configMap: Record<string, Record<string, string>> = {};
      data?.forEach((s: AutomationSetting) => {
        configMap[s.platform] = s.config as Record<string, string>;
      });
      setConfigs(configMap);
      
      return data as AutomationSetting[];
    }
  });

  const { data: logs } = useQuery({
    queryKey: ['automation-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('automation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as AutomationLog[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async ({ platform, config, isEnabled }: { platform: string; config: Record<string, string>; isEnabled: boolean }) => {
      const existing = settings?.find(s => s.platform === platform);
      
      if (existing) {
        const { error } = await supabase
          .from('automation_settings')
          .update({ config, is_enabled: isEnabled })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('automation_settings')
          .insert({ platform, config, is_enabled: isEnabled });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automation-settings'] });
      toast({ title: 'تم الحفظ', description: 'تم حفظ الإعدادات بنجاح' });
    },
    onError: (error) => {
      toast({ title: 'خطأ', description: 'فشل في حفظ الإعدادات', variant: 'destructive' });
    }
  });

  const testMutation = useMutation({
    mutationFn: async (platform: string) => {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          platform,
          test: true,
          message: '🎉 اختبار النشر التلقائي من Sky Icon Travel'
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل في الاختبار');
      }
      
      return response.json();
    },
    onSuccess: (_, platform) => {
      toast({ title: 'نجاح', description: `تم إرسال رسالة اختبار إلى ${platformConfig.find(p => p.id === platform)?.name}` });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    }
  });

  const testPlatform = async (platform: string): Promise<{ ok: boolean; error?: string }> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/social-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
        },
        body: JSON.stringify({
          platform,
          test: true,
          message: '🎉 اختبار النشر التلقائي من Sky Icon Travel'
        })
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return { ok: false, error: err.error || `HTTP ${response.status}` };
      }
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : 'unknown' };
    }
  };

  const handleTestAll = async () => {
    const enabled = (settings || []).filter(s => s.is_enabled);
    if (enabled.length === 0) {
      toast({
        title: 'لا توجد منصات مفعّلة',
        description: 'فعّل منصة واحدة على الأقل قبل الاختبار.',
        variant: 'destructive'
      });
      return;
    }
    setTestingAll(true);
    const results: { platform: string; ok: boolean; error?: string }[] = [];
    for (const s of enabled) {
      setTestingPlatform(s.platform);
      const r = await testPlatform(s.platform);
      results.push({ platform: s.platform, ...r });
    }
    setTestingPlatform(null);
    setTestingAll(false);
    queryClient.invalidateQueries({ queryKey: ['automation-logs'] });

    const success = results.filter(r => r.ok).length;
    const failed = results.length - success;
    const lines = results.map(r => {
      const name = platformConfig.find(p => p.id === r.platform)?.name || r.platform;
      return r.ok ? `✅ ${name}` : `❌ ${name}: ${r.error}`;
    });
    toast({
      title: `اكتمل الاختبار: ${success} نجاح / ${failed} فشل`,
      description: lines.join(' • '),
      variant: failed > 0 ? 'destructive' : 'default'
    });
  };

  const handleConfigChange = (platform: string, key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [key]: value
      }
    }));
  };

  const handleSave = (platform: string) => {
    const setting = settings?.find(s => s.platform === platform);
    saveMutation.mutate({
      platform,
      config: configs[platform] || {},
      isEnabled: setting?.is_enabled || false
    });
  };

  const handleToggle = (platform: string, enabled: boolean) => {
    saveMutation.mutate({
      platform,
      config: configs[platform] || {},
      isEnabled: enabled
    });
  };

  const handleClearTokens = (platformId: string) => {
    const platform = platformConfig.find(p => p.id === platformId);
    if (!platform) return;
    const cleared: Record<string, string> = { ...(configs[platformId] || {}) };
    platform.fields.forEach(f => {
      if (f.type === 'password') cleared[f.key] = '';
    });
    setConfigs(prev => ({ ...prev, [platformId]: cleared }));
    toast({ title: 'تم مسح التوكنات', description: 'لا تنسَ الضغط على "حفظ" لتأكيد التغيير.' });
  };

  const toggleReveal = (key: string) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getSettingForPlatform = (platform: string) => {
    return settings?.find(s => s.platform === platform);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 ml-1" /> نجاح</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" /> فشل</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" /> انتظار</Badge>;
    }
  };

  const getContentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      announcements: 'إعلان',
      packages: 'باقة',
      services: 'خدمة',
      gallery: 'صورة'
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">الأتمتة والنشر التلقائي</h1>
          <p className="text-muted-foreground">
            نشر المحتوى تلقائياً على وسائل التواصل الاجتماعي
          </p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="settings" className="gap-2">
              <Settings2 className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <History className="h-4 w-4" />
              سجل النشر
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={handleTestAll}
            disabled={testingAll}
            variant="secondary"
            className="gap-2"
          >
            {testingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <PlayCircle className="h-4 w-4" />
            )}
            {testingAll
              ? `جارٍ اختبار ${platformConfig.find(p => p.id === testingPlatform)?.name || ''}...`
              : 'اختبار الكل'}
          </Button>
        </div>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {platformConfig.map((platform) => {
              const setting = getSettingForPlatform(platform.id);
              const Icon = platform.icon;
              
              return (
                <Card key={platform.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${platform.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          <CardDescription>{platform.description}</CardDescription>
                        </div>
                      </div>
                      <Switch
                        checked={setting?.is_enabled || false}
                        onCheckedChange={(checked) => handleToggle(platform.id, checked)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {platform.fields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={`${platform.id}-${field.key}`}>{field.label}</Label>
                        {field.type === 'password' ? (
                          <div className="relative">
                            <Input
                              id={`${platform.id}-${field.key}`}
                              type={revealed[`${platform.id}-${field.key}`] ? 'text' : 'password'}
                              placeholder={field.placeholder}
                              value={configs[platform.id]?.[field.key] || ''}
                              onChange={(e) => handleConfigChange(platform.id, field.key, e.target.value)}
                              dir="ltr"
                              autoComplete="new-password"
                              className="pl-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8"
                              onClick={() => toggleReveal(`${platform.id}-${field.key}`)}
                              tabIndex={-1}
                            >
                              {revealed[`${platform.id}-${field.key}`] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <Input
                            id={`${platform.id}-${field.key}`}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={configs[platform.id]?.[field.key] || ''}
                            onChange={(e) => handleConfigChange(platform.id, field.key, e.target.value)}
                            dir="ltr"
                          />
                        )}
                      </div>
                    ))}
                    {setting?.updated_at && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        آخر تحديث: {new Date(setting.updated_at).toLocaleString('ar-EG', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={() => handleSave(platform.id)}
                        disabled={saveMutation.isPending}
                        className="flex-1"
                      >
                        {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'حفظ'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => testMutation.mutate(platform.id)}
                        disabled={testMutation.isPending || !setting?.is_enabled}
                      >
                        {testMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'اختبار'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleClearTokens(platform.id)}
                        title="مسح التوكنات (للتدوير)"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>كيفية الإعداد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">📱 تيليغرام (الأسهل - مجاني)</h4>
                <ol className="list-decimal list-inside space-y-1 mr-4">
                  <li>افتح @BotFather في تيليغرام وأنشئ بوت جديد بالأمر /newbot</li>
                  <li>انسخ التوكن الذي يعطيك إياه</li>
                  <li>أضف البوت كمشرف في قناتك أو مجموعتك</li>
                  <li>للقناة العامة: استخدم @اسم_القناة</li>
                  <li>للمجموعة: استخدم معرف المجموعة (يمكنك معرفته من @userinfobot)</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">📘 فيسبوك</h4>
                <p>تحتاج إلى إنشاء تطبيق في Meta for Developers والحصول على Page Access Token</p>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-2">📷 انستغرام</h4>
                <p>يتطلب حساب بيزنس مرتبط بصفحة فيسبوك وتطبيق Meta</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>سجل النشر</CardTitle>
              <CardDescription>آخر 50 عملية نشر</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {logs && logs.length > 0 ? (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const platform = platformConfig.find(p => p.id === log.platform);
                            const Icon = platform?.icon || Send;
                            return (
                              <div className={`p-2 rounded ${platform?.color || 'bg-gray-500'} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                            );
                          })()}
                          <div>
                            <p className="font-medium">{getContentTypeLabel(log.content_type)}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.created_at).toLocaleString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(log.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    لا توجد سجلات بعد
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;
