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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, DollarSign, Loader2 } from 'lucide-react';
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

interface ServicePricing {
  id: string;
  service_id: string | null;
  tier_name_ar: string;
  tier_name_en: string;
  tier_name_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  price: number;
  currency: string;
  is_active: boolean;
  display_order: number;
}

interface Service {
  id: string;
  title_ar: string;
}

const defaultFormData = {
  service_id: '',
  tier_name: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  price: 0,
  currency: 'USD',
  display_order: 0,
  is_active: true,
};

const ServicePricing = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServicePricing | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ServicePricing | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleTierNameChange = createTranslateHandler('tier_name', setFormData);
  const handleDescriptionChange = createTranslateHandler('description', setFormData);

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase.from('services').select('id, title_ar').order('display_order');
      if (error) throw error;
      return data as Service[];
    },
  });

  const { data = [], isLoading } = useQuery({
    queryKey: ['service_pricing'],
    queryFn: async () => {
      const { data, error } = await supabase.from('service_pricing').select('*').order('display_order');
      if (error) throw error;
      return data as ServicePricing[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<ServicePricing, 'id'>) => {
      const { data, error } = await supabase.from('service_pricing').insert(item as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_pricing'] });
      toast({ title: 'تم الإنشاء', description: 'تم إضافة السعر بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ServicePricing> & { id: string }) => {
      const { data, error } = await supabase.from('service_pricing').update(updates as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_pricing'] });
      toast({ title: 'تم التحديث', description: 'تم تعديل السعر بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('service_pricing').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service_pricing'] });
      toast({ title: 'تم الحذف', description: 'تم حذف السعر بنجاح' });
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

  const handleEdit = (item: ServicePricing) => {
    setEditingItem(item);
    setFormData({
      service_id: item.service_id || '',
      tier_name: { ar: item.tier_name_ar, en: item.tier_name_en, fr: item.tier_name_fr },
      description: { ar: item.description_ar || '', en: item.description_en || '', fr: item.description_fr || '' },
      price: item.price,
      currency: item.currency,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: ServicePricing) => {
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

  const handleToggleActive = (item: ServicePricing) => {
    updateMutation.mutate({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      service_id: formData.service_id || null,
      tier_name_ar: formData.tier_name.ar || 'بدون اسم',
      tier_name_en: formData.tier_name.en || 'Unnamed',
      tier_name_fr: formData.tier_name.fr || 'Sans nom',
      description_ar: formData.description.ar || null,
      description_en: formData.description.en || null,
      description_fr: formData.description.fr || null,
      price: formData.price,
      currency: formData.currency,
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
    {
      key: 'service_id',
      header: 'الخدمة',
      render: (item: ServicePricing) => {
        const service = services.find(s => s.id === item.service_id);
        return service?.title_ar || 'عام';
      },
    },
    { key: 'tier_name_ar', header: 'اسم الفئة' },
    {
      key: 'price',
      header: 'السعر',
      render: (item: ServicePricing) => `${item.price} ${item.currency}`,
    },
    { key: 'display_order', header: 'الترتيب' },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: ServicePricing) => (
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
            <DollarSign className="h-8 w-8 text-secondary" />
            أسعار الخدمات
          </h1>
          <p className="text-muted-foreground mt-1">إدارة أسعار الخدمات (تظهر للمشتركين فقط)</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة سعر
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
        title={editingItem ? 'تعديل السعر' : 'إضافة سعر'}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-2">
          <Label>الخدمة</Label>
          <Select value={formData.service_id} onValueChange={(v) => setFormData({ ...formData, service_id: v })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">عام</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.title_ar}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative">
          <MultilingualInput
            label="اسم الفئة"
            values={formData.tier_name}
            onChange={handleTierNameChange}
          />
          {translating && (
            <div className="absolute top-0 left-0 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              جاري الترجمة...
            </div>
          )}
        </div>

        <MultilingualInput
          label="الوصف"
          values={formData.description}
          onChange={handleDescriptionChange}
          isTextarea
        />

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
                <SelectItem value="EUR">EUR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
            <AlertDialogTitle className="text-right">حذف السعر</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف "{itemToDelete?.tier_name_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
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

export default ServicePricing;
