import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CalendarDays, Phone, Users, Trash2, Package, Clock } from 'lucide-react';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  travelers_count: number;
  package_title: string;
  package_price: string | null;
  notes: string | null;
  status: BookingStatus;
  created_at: string;
}

const statusConfig: Record<BookingStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
  pending: { label: 'قيد الانتظار', variant: 'default' },
  confirmed: { label: 'مؤكد', variant: 'secondary' },
  cancelled: { label: 'ملغي', variant: 'destructive' },
};

const Bookings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: BookingStatus }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'تم تحديث حالة الحجز' });
    },
  });

  const deleteBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast({ title: 'تم حذف الحجز' });
    },
  });

  const filtered = bookings?.filter(b => filter === 'all' || b.status === filter) || [];

  const counts = {
    all: bookings?.length || 0,
    pending: bookings?.filter(b => b.status === 'pending').length || 0,
    confirmed: bookings?.filter(b => b.status === 'confirmed').length || 0,
    cancelled: bookings?.filter(b => b.status === 'cancelled').length || 0,
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold font-playfair">إدارة الحجوزات</h1>
        <p className="text-muted-foreground">عرض وإدارة جميع طلبات الحجز</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'all', label: 'الكل', count: counts.all, color: 'bg-primary/10 text-primary' },
          { key: 'pending', label: 'قيد الانتظار', count: counts.pending, color: 'bg-yellow-100 text-yellow-800' },
          { key: 'confirmed', label: 'مؤكد', count: counts.confirmed, color: 'bg-green-100 text-green-800' },
          { key: 'cancelled', label: 'ملغي', count: counts.cancelled, color: 'bg-red-100 text-red-800' },
        ].map(stat => (
          <button
            key={stat.key}
            onClick={() => setFilter(stat.key)}
            className={`p-4 rounded-xl text-center transition-all ${filter === stat.key ? 'ring-2 ring-primary shadow-md' : 'hover:shadow-sm'} ${stat.color}`}
          >
            <div className="text-3xl font-bold ltr-nums">{stat.count}</div>
            <div className="text-sm mt-1">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">جارٍ التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="mx-auto h-12 w-12 mb-4 opacity-40" />
          <p>لا توجد حجوزات</p>
        </div>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">الباقة</TableHead>
                <TableHead className="text-right">المسافرين</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div className="font-medium">{booking.customer_name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1" dir="ltr">
                      <Phone size={12} />
                      {booking.customer_phone}
                    </div>
                    {booking.notes && (
                      <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                        📝 {booking.notes}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.package_title}</div>
                    {booking.package_price && (
                      <div className="text-sm text-secondary font-bold ltr-nums">{booking.package_price}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users size={14} />
                      <span className="ltr-nums">{booking.travelers_count}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock size={14} />
                      {new Date(booking.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={booking.status}
                      onValueChange={(val) => updateStatus.mutate({ id: booking.id, status: val as BookingStatus })}
                    >
                      <SelectTrigger className="w-[130px]">
                        <Badge variant={statusConfig[booking.status].variant}>
                          {statusConfig[booking.status].label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">قيد الانتظار</SelectItem>
                        <SelectItem value="confirmed">مؤكد</SelectItem>
                        <SelectItem value="cancelled">ملغي</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent dir="rtl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف الحجز</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف حجز {booking.customer_name}؟ لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-row-reverse gap-2">
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteBooking.mutate(booking.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Bookings;
