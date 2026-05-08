import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from './AdminSidebar';
import { Loader2, Menu, Plane } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex flex-row-reverse bg-muted" dir="rtl">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar (Sheet drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="p-0 w-72 max-w-[85vw]" dir="rtl">
          <div onClick={() => setOpen(false)}>
            <AdminSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-card rounded-lg p-3 shadow-soft">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Plane className="h-4 w-4 text-secondary-foreground" />
            </div>
            <span className="font-bold text-sm">لوحة الإدارة</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
