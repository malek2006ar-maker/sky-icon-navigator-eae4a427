import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Images, Package, Settings, Megaphone, TrendingUp, MessageSquareQuote, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { data: slidersCount, isLoading: loadingSliders } = useQuery({
    queryKey: ['sliders-count'],
    queryFn: async () => {
      const { count } = await supabase.from('sliders').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: servicesCount, isLoading: loadingServices } = useQuery({
    queryKey: ['services-count'],
    queryFn: async () => {
      const { count } = await supabase.from('services').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: packagesCount, isLoading: loadingPackages } = useQuery({
    queryKey: ['packages-count'],
    queryFn: async () => {
      const { count } = await supabase.from('packages').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: announcementsCount, isLoading: loadingAnnouncements } = useQuery({
    queryKey: ['announcements-count'],
    queryFn: async () => {
      const { count } = await supabase.from('announcements').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: galleryCount, isLoading: loadingGallery } = useQuery({
    queryKey: ['gallery-count'],
    queryFn: async () => {
      const { count } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: testimonialsCount, isLoading: loadingTestimonials } = useQuery({
    queryKey: ['testimonials-count'],
    queryFn: async () => {
      const { count } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: statsCount, isLoading: loadingStats } = useQuery({
    queryKey: ['stats-count'],
    queryFn: async () => {
      const { count } = await supabase.from('stats').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const stats = [
    { 
      title: 'الشرائح', 
      value: slidersCount, 
      loading: loadingSliders, 
      icon: Images, 
      color: 'bg-blue-500',
      link: '/admin/sliders'
    },
    { 
      title: 'الخدمات', 
      value: servicesCount, 
      loading: loadingServices, 
      icon: Settings, 
      color: 'bg-green-500',
      link: '/admin/services'
    },
    { 
      title: 'الباقات', 
      value: packagesCount, 
      loading: loadingPackages, 
      icon: Package, 
      color: 'bg-purple-500',
      link: '/admin/packages'
    },
    { 
      title: 'الإعلانات', 
      value: announcementsCount, 
      loading: loadingAnnouncements, 
      icon: Megaphone, 
      color: 'bg-orange-500',
      link: '/admin/announcements'
    },
    { 
      title: 'معرض الصور', 
      value: galleryCount, 
      loading: loadingGallery, 
      icon: ImageIcon, 
      color: 'bg-pink-500',
      link: '/admin/gallery'
    },
    { 
      title: 'الشهادات', 
      value: testimonialsCount, 
      loading: loadingTestimonials, 
      icon: MessageSquareQuote, 
      color: 'bg-teal-500',
      link: '/admin/testimonials'
    },
    { 
      title: 'الإحصائيات', 
      value: statsCount, 
      loading: loadingStats, 
      icon: BarChart3, 
      color: 'bg-indigo-500',
      link: '/admin/stats'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground mt-2">مرحباً بك في لوحة إدارة Sky Icon</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-secondary" />
            إجراءات سريعة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            استخدم القائمة الجانبية لإدارة محتوى موقعك. يمكنك إضافة أو تعديل أو حذف الشرائح والخدمات والباقات والإعلانات.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
