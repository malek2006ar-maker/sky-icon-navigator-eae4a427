import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import MultilingualInput from '@/components/admin/MultilingualInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Plane, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface YemeniaFlight {
  id: string;
  flight_number: string;
  departure_city_ar: string;
  departure_city_en: string;
  departure_city_fr: string;
  arrival_city_ar: string;
  arrival_city_en: string;
  arrival_city_fr: string;
  departure_time: string;
  arrival_time: string;
  days_of_week: string[];
  price: number | null;
  currency: string;
  notes_ar: string | null;
  notes_en: string | null;
  notes_fr: string | null;
  is_active: boolean;
  display_order: number;
}

const daysOfWeek = [
  { value: 'sunday', label: 'الأحد' },
  { value: 'monday', label: 'الإثنين' },
  { value: 'tuesday', label: 'الثلاثاء' },
  { value: 'wednesday', label: 'الأربعاء' },
  { value: 'thursday', label: 'الخميس' },
  { value: 'friday', label: 'الجمعة' },
  { value: 'saturday', label: 'السبت' },
];

const defaultFormData = {
  flight_number: '',
  departure_city: { ar: '', en: '', fr: '' },
  arrival_city: { ar: '', en: '', fr: '' },
  departure_time: '08:00',
  arrival_time: '10:00',
  days_of_week: [] as string[],
  price: 0,
  currency: 'USD',
  notes: { ar: '', en: '', fr: '' },
  display_order: 0,
  is_active: true,
};

const YemeniaFlights = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<YemeniaFlight | null>(null);
  const [itemToDelete, setItemToDelete] = useState<YemeniaFlight | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleDepartureCityChange = createTranslateHandler('departure_city', setFormData);
  const handleArrivalCityChange = createTranslateHandler('arrival_city', setFormData);
  const handleNotesChange = createTranslateHandler('notes', setFormData);

  const { data = [], isLoading } = useQuery({
    queryKey: ['yemenia_flights'],
    queryFn: async () => {
      const { data, error } = await supabase.from('yemenia_flights').select('*').order('display_order');
      if (error) throw error;
      return data as YemeniaFlight[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<YemeniaFlight, 'id'>) => {
      const { data, error } = await supabase.from('yemenia_flights').insert(item as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yemenia_flights'] });
      toast({ title: 'تم الإنشاء', description: 'تم إضافة الرحلة بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<YemeniaFlight> & { id: string }) => {
      const { data, error } = await supabase.from('yemenia_flights').update(updates as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yemenia_flights'] });
      toast({ title: 'تم التحديث', description: 'تم تعديل الرحلة بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('yemenia_flights').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['yemenia_flights'] });
      toast({ title: 'تم الحذف', description: 'تم حذف الرحلة بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: YemeniaFlight) => {
    setEditingItem(item);
    setFormData({
      flight_number: item.flight_number,
      departure_city: { ar: item.departure_city_ar, en: item.departure_city_en, fr: item.departure_city_fr },
      arrival_city: { ar: item.arrival_city_ar, en: item.arrival_city_en, fr: item.arrival_city_fr },
      departure_time: item.departure_time,
      arrival_time: item.arrival_time,
      days_of_week: item.days_of_week || [],
      price: item.price || 0,
      currency: item.currency,
      notes: { ar: item.notes_ar || '', en: item.notes_en || '', fr: item.notes_fr || '' },
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: YemeniaFlight) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleActive = (item: YemeniaFlight) => {
    updateMutation.mutate({ id: item.id, is_active: !item.is_active });
  };

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days_of_week: prev.days_of_week.includes(day)
        ? prev.days_of_week.filter(d => d !== day)
        : [...prev.days_of_week, day],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      flight_number: formData.flight_number,
      departure_city_ar: formData.departure_city.ar || 'غير محدد',
      departure_city_en: formData.departure_city.en || 'Unknown',
      departure_city_fr: formData.departure_city.fr || 'Inconnu',
      arrival_city_ar: formData.arrival_city.ar || 'غير محدد',
      arrival_city_en: formData.arrival_city.en || 'Unknown',
      arrival_city_fr: formData.arrival_city.fr || 'Inconnu',
      departure_time: formData.departure_time,
      arrival_time: formData.arrival_time,
      days_of_week: formData.days_of_week,
      price: formData.price || null,
      currency: formData.currency,
      notes_ar: formData.notes.ar || null,
      notes_en: formData.notes.en || null,
      notes_fr: formData.notes.fr || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, ...payload });
    } else {
      createMutation.mutate(payload as any);
    }
    setDialogOpen(false);
  };

  const columns = [
    { key: 'flight_number', header: 'رقم الرحلة' },
    { key: 'departure_city_ar', header: 'مدينة المغادرة' },
    { key: 'arrival_city_ar', header: 'مدينة الوصول' },
    {
      key: 'times',
      header: 'التوقيت',
      render: (item: YemeniaFlight) => `${item.departure_time} - ${item.arrival_time}`,
    },
    {
      key: 'days_of_week',
      header: 'أيام التشغيل',
      render: (item: YemeniaFlight) => (
        <div className="flex flex-wrap gap-1">
          {item.days_of_week?.map(day => (
            <Badge key={day} variant="outline" className="text-xs">
              {daysOfWeek.find(d => d.value === day)?.label}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: YemeniaFlight) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'نشط' : 'غير نشط'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground flex items-center gap-3">
            <Plane className="h-8 w-8 text-secondary" />
            رحلات اليمنية
          </h1>
          <p className="text-muted-foreground mt-1">إدارة جدول رحلات الخطوط الجوية اليمنية</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة رحلة
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingItem ? 'تعديل الرحلة' : 'إضافة رحلة'}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-2">
          <Label>رقم الرحلة</Label>
          <Input
            value={formData.flight_number}
            onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
            placeholder="IY123"
            dir="ltr"
          />
        </div>

        <div className="relative">
          <MultilingualInput
            label="مدينة المغادرة"
            values={formData.departure_city}
            onChange={handleDepartureCityChange}
          />
          {translating && (
            <div className="absolute top-0 left-0 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الترجمة...
            </div>
          )}
        </div>

        <MultilingualInput
          label="مدينة الوصول"
          values={formData.arrival_city}
          onChange={handleArrivalCityChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>وقت المغادرة</Label>
            <Input
              type="time"
              value={formData.departure_time}
              onChange={(e) => setFormData({ ...formData, departure_time: e.target.value })}
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>وقت الوصول</Label>
            <Input
              type="time"
              value={formData.arrival_time}
              onChange={(e) => setFormData({ ...formData, arrival_time: e.target.value })}
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>أيام التشغيل</Label>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map(day => (
              <div key={day.value} className="flex items-center gap-2">
                <Checkbox
                  id={day.value}
                  checked={formData.days_of_week.includes(day.value)}
                  onCheckedChange={() => toggleDay(day.value)}
                />
                <label htmlFor={day.value} className="text-sm cursor-pointer">{day.label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>السعر</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>العملة</Label>
            <Select value={formData.currency} onValueChange={(v) => setFormData({ ...formData, currency: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="YER">YER</SelectItem>
                <SelectItem value="SAR">SAR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <MultilingualInput
          label="ملاحظات"
          values={formData.notes}
          onChange={handleNotesChange}
          isTextarea
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ترتيب العرض</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label>نشط</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">حذف الرحلة</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف الرحلة "{itemToDelete?.flight_number}"؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              حذف
            </AlertDialogAction>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default YemeniaFlights;
