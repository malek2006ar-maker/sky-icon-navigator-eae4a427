import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Images, 
  Package, 
  Settings, 
  Megaphone,
  LogOut,
  Plane,
  Home,
  Image as ImageIcon,
  Cog,
  MessageSquareQuote,
  BarChart3,
  Bot,
  DollarSign,
  Link2,
  CalendarCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'لوحة التحكم', end: true },
  { to: '/admin/sliders', icon: Images, label: 'الشرائح' },
  { to: '/admin/services', icon: Settings, label: 'الخدمات' },
  { to: '/admin/service-pricing', icon: DollarSign, label: 'أسعار الخدمات' },
  { to: '/admin/packages', icon: Package, label: 'الباقات' },
  { to: '/admin/bookings', icon: CalendarCheck, label: 'الحجوزات' },
  { to: '/admin/yemenia-flights', icon: Plane, label: 'رحلات اليمنية' },
  { to: '/admin/announcements', icon: Megaphone, label: 'الإعلانات' },
  { to: '/admin/gallery', icon: ImageIcon, label: 'معرض الصور' },
  { to: '/admin/testimonials', icon: MessageSquareQuote, label: 'الشهادات' },
  { to: '/admin/stats', icon: BarChart3, label: 'الإحصائيات' },
  { to: '/admin/external-links', icon: Link2, label: 'روابط خارجية' },
  { to: '/admin/automation', icon: Bot, label: 'الأتمتة' },
  { to: '/admin/settings', icon: Cog, label: 'الإعدادات' },
];

const AdminSidebar = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <aside className="w-64 min-h-screen bg-primary text-primary-foreground flex flex-col">
      <div className="p-6 border-b border-primary-foreground/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
            <Plane className="h-5 w-5 text-secondary-foreground" />
          </div>
          <div>
            <h1 className="font-playfair font-bold text-lg">Sky Icon</h1>
            <p className="text-xs text-primary-foreground/70">لوحة الإدارة</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-secondary text-secondary-foreground font-medium'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-primary-foreground/20 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5 ml-3" />
          عرض الموقع
        </Button>
        
        <div className="px-4 py-2 text-xs text-primary-foreground/60">
          مسجل الدخول كـ<br />
          <span className="text-primary-foreground/80 truncate block">{user?.email}</span>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-primary-foreground/80 hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 ml-3" />
          تسجيل الخروج
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
