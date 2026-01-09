import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import MultilingualInput from '@/components/admin/MultilingualInput';

interface Testimonial {
  id: string;
  name_ar: string;
  name_en: string;
  name_fr: string;
  role_ar: string;
  role_en: string;
  role_fr: string;
  content_ar: string;
  content_en: string;
  content_fr: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
}

const defaultTestimonial: Omit<Testimonial, 'id'> = {
  name_ar: '',
  name_en: '',
  name_fr: '',
  role_ar: '',
  role_en: '',
  role_fr: '',
  content_ar: '',
  content_en: '',
  content_fr: '',
  rating: 5,
  avatar_url: null,
  is_active: true,
  display_order: 0,
};

const Testimonials = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Omit<Testimonial, 'id'>>(defaultTestimonial);
  const queryClient = useQueryClient();

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Testimonial, 'id'>) => {
      const { error } = await supabase.from('testimonials').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('تم إضافة الشهادة بنجاح');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('فشل في إضافة الشهادة');
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Omit<Testimonial, 'id'> }) => {
      const { error } = await supabase.from('testimonials').update(data).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('تم تحديث الشهادة بنجاح');
      handleCloseDialog();
    },
    onError: (error) => {
      toast.error('فشل في تحديث الشهادة');
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      toast.success('تم حذف الشهادة بنجاح');
    },
    onError: (error) => {
      toast.error('فشل في حذف الشهادة');
      console.error(error);
    },
  });

  const handleOpenDialog = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name_ar: item.name_ar,
        name_en: item.name_en,
        name_fr: item.name_fr,
        role_ar: item.role_ar,
        role_en: item.role_en,
        role_fr: item.role_fr,
        content_ar: item.content_ar,
        content_en: item.content_en,
        content_fr: item.content_fr,
        rating: item.rating,
        avatar_url: item.avatar_url,
        is_active: item.is_active,
        display_order: item.display_order,
      });
    } else {
      setEditingItem(null);
      setFormData(defaultTestimonial);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setFormData(defaultTestimonial);
  };

  const handleSubmit = () => {
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'name_ar', header: 'الاسم' },
    { key: 'role_ar', header: 'المنصب' },
    { 
      key: 'rating', 
      header: 'التقييم',
      render: (item: Testimonial) => (
        <div className="flex gap-0.5">
          {[...Array(item.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
          ))}
        </div>
      )
    },
    { 
      key: 'is_active', 
      header: 'الحالة',
      render: (item: Testimonial) => (
        <span className={`px-2 py-1 rounded-full text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {item.is_active ? 'نشط' : 'غير نشط'}
        </span>
      )
    },
    { key: 'display_order', header: 'الترتيب' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-foreground">الشهادات</h1>
          <p className="text-muted-foreground mt-2">إدارة شهادات وآراء العملاء</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          إضافة شهادة
        </Button>
      </div>

      <DataTable
        data={testimonials || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={handleOpenDialog}
        onDelete={(item) => deleteMutation.mutate(item.id)}
      />

      <FormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingItem ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="space-y-6">
          <MultilingualInput
            label="الاسم"
            values={{
              ar: formData.name_ar,
              en: formData.name_en,
              fr: formData.name_fr,
            }}
            onChange={(values) => setFormData({ ...formData, name_ar: values.ar, name_en: values.en, name_fr: values.fr })}
          />

          <MultilingualInput
            label="المنصب / الوصف"
            values={{
              ar: formData.role_ar,
              en: formData.role_en,
              fr: formData.role_fr,
            }}
            onChange={(values) => setFormData({ ...formData, role_ar: values.ar, role_en: values.en, role_fr: values.fr })}
          />

          <div className="space-y-2">
            <Label>المحتوى (عربي)</Label>
            <Textarea
              value={formData.content_ar}
              onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
              placeholder="محتوى الشهادة بالعربية"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>المحتوى (إنجليزي)</Label>
            <Textarea
              value={formData.content_en}
              onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
              placeholder="Content in English"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>المحتوى (فرنسي)</Label>
            <Textarea
              value={formData.content_fr}
              onChange={(e) => setFormData({ ...formData, content_fr: e.target.value })}
              placeholder="Contenu en français"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>التقييم</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 transition-colors ${
                      star <= formData.rating 
                        ? 'fill-secondary text-secondary' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                </button>
              ))}
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

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <Label>نشط</Label>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>
        </div>
      </FormDialog>
    </div>
  );
};

export default Testimonials;
