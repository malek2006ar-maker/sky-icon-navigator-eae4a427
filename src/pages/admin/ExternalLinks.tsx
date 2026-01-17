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
import { Plus, Link2, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
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

interface ExternalLink {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  url: string;
  thumbnail_url: string | null;
  category: string;
  is_active: boolean;
  display_order: number;
}

const categoryOptions = [
  { value: 'general', label: 'عام' },
  { value: 'airlines', label: 'شركات طيران' },
  { value: 'hotels', label: 'فنادق' },
  { value: 'embassies', label: 'سفارات' },
  { value: 'tourism', label: 'سياحة' },
  { value: 'government', label: 'حكومي' },
];

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  url: '',
  thumbnail_url: '',
  category: 'general',
  display_order: 0,
  is_active: true,
};

const ExternalLinks = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExternalLink | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ExternalLink | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [fetchingThumbnail, setFetchingThumbnail] = useState(false);

  const handleTitleChange = createTranslateHandler('title', setFormData);
  const handleDescriptionChange = createTranslateHandler('description', setFormData);

  const { data = [], isLoading } = useQuery({
    queryKey: ['external_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('external_links').select('*').order('display_order');
      if (error) throw error;
      return data as ExternalLink[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<ExternalLink, 'id'>) => {
      const { data, error } = await supabase.from('external_links').insert(item as any).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external_links'] });
      toast({ title: 'تم الإنشاء', description: 'تم إضافة الرابط بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ExternalLink> & { id: string }) => {
      const { data, error } = await supabase.from('external_links').update(updates as any).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external_links'] });
      toast({ title: 'تم التحديث', description: 'تم تعديل الرابط بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('external_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['external_links'] });
      toast({ title: 'تم الحذف', description: 'تم حذف الرابط بنجاح' });
    },
    onError: (error: Error) => {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    },
  });

  const fetchThumbnail = async () => {
    if (!formData.url) {
      toast({ title: 'خطأ', description: 'أدخل الرابط أولاً', variant: 'destructive' });
      return;
    }
    
    setFetchingThumbnail(true);
    try {
      // Use a screenshot API service to get website thumbnail
      const encodedUrl = encodeURIComponent(formData.url);
      const thumbnailUrl = `https://image.thum.io/get/width/400/crop/300/${encodedUrl}`;
      setFormData({ ...formData, thumbnail_url: thumbnailUrl });
      toast({ title: 'تم', description: 'تم جلب الصورة المصغرة' });
    } catch (error) {
      toast({ title: 'خطأ', description: 'فشل جلب الصورة المصغرة', variant: 'destructive' });
    } finally {
      setFetchingThumbnail(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: ExternalLink) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      description: { ar: item.description_ar || '', en: item.description_en || '', fr: item.description_fr || '' },
      url: item.url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: ExternalLink) => {
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

  const handleToggleActive = (item: ExternalLink) => {
    updateMutation.mutate({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_ar: formData.title.ar || 'بدون عنوان',
      title_en: formData.title.en || 'Untitled',
      title_fr: formData.title.fr || 'Sans titre',
      description_ar: formData.description.ar || null,
      description_en: formData.description.en || null,
      description_fr: formData.description.fr || null,
      url: formData.url,
      thumbnail_url: formData.thumbnail_url || null,
      category: formData.category,
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
      key: 'thumbnail_url',
      header: 'المعاينة',
      render: (item: ExternalLink) => (
        item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.title_ar}
            className="w-24 h-16 object-cover rounded border"
          />
        ) : (
          <div className="w-24 h-16 bg-muted rounded border flex items-center justify-center">
            <Link2 className="h-6 w-6 text-muted-foreground" />
          </div>
        )
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    {
      key: 'url',
      header: 'الرابط',
      render: (item: ExternalLink) => (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          <ExternalLink className="h-3 w-3" />
          {new URL(item.url).hostname}
        </a>
      ),
    },
    {
      key: 'category',
      header: 'الفئة',
      render: (item: ExternalLink) => (
        <Badge variant="outline">
          {categoryOptions.find(c => c.value === item.category)?.label}
        </Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: ExternalLink) => (
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
            <Link2 className="h-8 w-8 text-secondary" />
            الروابط الخارجية
          </h1>
          <p className="text-muted-foreground mt-1">إدارة روابط المواقع الخارجية مع معاينة</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة رابط
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
        title={editingItem ? 'تعديل الرابط' : 'إضافة رابط'}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <div className="relative">
          <MultilingualInput
            label="العنوان"
            values={formData.title}
            onChange={handleTitleChange}
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

        <div className="space-y-2">
          <Label>الرابط (URL)</Label>
          <div className="flex gap-2">
            <Input
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://example.com"
              dir="ltr"
              className="flex-1"
            />
            <Button type="button" variant="outline" onClick={fetchThumbnail} disabled={fetchingThumbnail}>
              {fetchingThumbnail ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {formData.thumbnail_url && (
          <div className="space-y-2">
            <Label>معاينة الموقع</Label>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={formData.thumbnail_url}
                alt="معاينة"
                className="w-full h-40 object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>رابط الصورة المصغرة (اختياري)</Label>
          <Input
            value={formData.thumbnail_url}
            onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
            placeholder="https://..."
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <Label>الفئة</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <AlertDialogTitle className="text-right">حذف الرابط</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف "{itemToDelete?.title_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
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

export default ExternalLinks;
