import React, { useState } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import MultilingualInput from '@/components/admin/MultilingualInput';
import ImageUpload from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Images, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

interface Slider {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  subtitle_ar: string | null;
  subtitle_en: string | null;
  subtitle_fr: string | null;
  image_url: string;
  button_text_ar: string | null;
  button_text_en: string | null;
  button_text_fr: string | null;
  button_link: string | null;
  display_order: number;
  is_active: boolean;
}

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  subtitle: { ar: '', en: '', fr: '' },
  button_text: { ar: '', en: '', fr: '' },
  image_url: '',
  button_link: '',
  display_order: 0,
  is_active: true,
};

const Sliders = () => {
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<Slider>('sliders');
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Slider | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Slider | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleTitleChange = createTranslateHandler('title', setFormData);
  const handleSubtitleChange = createTranslateHandler('subtitle', setFormData);
  const handleButtonTextChange = createTranslateHandler('button_text', setFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: Slider) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      subtitle: { ar: item.subtitle_ar || '', en: item.subtitle_en || '', fr: item.subtitle_fr || '' },
      button_text: { ar: item.button_text_ar || '', en: item.button_text_en || '', fr: item.button_text_fr || '' },
      image_url: item.image_url,
      button_link: item.button_link || '',
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Slider) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete.id);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleToggleActive = (item: Slider) => {
    update({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_ar: formData.title.ar || 'بدون عنوان',
      title_en: formData.title.en || 'Untitled',
      title_fr: formData.title.fr || 'Sans titre',
      subtitle_ar: formData.subtitle.ar || null,
      subtitle_en: formData.subtitle.en || null,
      subtitle_fr: formData.subtitle.fr || null,
      button_text_ar: formData.button_text.ar || null,
      button_text_en: formData.button_text.en || null,
      button_text_fr: formData.button_text.fr || null,
      image_url: formData.image_url || '',
      button_link: formData.button_link || null,
      display_order: formData.display_order,
      is_active: formData.is_active,
    };

    if (editingItem) {
      update({ id: editingItem.id, ...payload });
    } else {
      create(payload);
    }
    setDialogOpen(false);
  };

  const columns = [
    {
      key: 'image_url',
      header: 'الصورة',
      render: (item: Slider) => (
        <img
          src={item.image_url}
          alt={item.title_ar}
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    { key: 'display_order', header: 'الترتيب' },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: Slider) => (
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
            <Images className="h-8 w-8 text-secondary" />
            الشرائح
          </h1>
          <p className="text-muted-foreground mt-1">إدارة شرائح الصفحة الرئيسية</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة شريحة
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
        title={editingItem ? 'تعديل الشريحة' : 'إضافة شريحة'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      >
        <ImageUpload
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
          label="صورة الشريحة"
        />
        
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
          label="العنوان الفرعي"
          values={formData.subtitle}
          onChange={handleSubtitleChange}
        />
        
        <MultilingualInput
          label="نص الزر"
          values={formData.button_text}
          onChange={handleButtonTextChange}
        />
        
        <div className="space-y-2">
          <Label>رابط الزر</Label>
          <Input
            value={formData.button_link}
            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
            placeholder="#packages"
            dir="ltr"
          />
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
            <AlertDialogTitle className="text-right">حذف الشريحة</AlertDialogTitle>
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

export default Sliders;
