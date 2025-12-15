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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Image as ImageIcon, Loader2 } from 'lucide-react';
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

interface GalleryItem {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  category: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

const categoryLabels: Record<string, string> = {
  'tourism': 'سياحة',
  'hajj-umrah': 'حج وعمرة',
  'hotels': 'فنادق',
  'flights': 'طيران',
};

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  category: 'tourism',
  image_url: '',
  display_order: 0,
  is_active: true,
};

const Gallery = () => {
  const { toast } = useToast();
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<GalleryItem>('gallery');
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleTitleChange = createTranslateHandler('title', setFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      category: item.category,
      image_url: item.image_url,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: GalleryItem) => {
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

  const handleToggleActive = (item: GalleryItem) => {
    update({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      toast({
        title: 'خطأ',
        description: 'يرجى رفع صورة',
        variant: 'destructive',
      });
      return;
    }

    const payload = {
      title_ar: formData.title.ar || 'بدون عنوان',
      title_en: formData.title.en || 'Untitled',
      title_fr: formData.title.fr || 'Sans titre',
      category: formData.category,
      image_url: formData.image_url,
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
      render: (item: GalleryItem) => (
        <img
          src={item.image_url}
          alt={item.title_ar}
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    {
      key: 'category',
      header: 'التصنيف',
      render: (item: GalleryItem) => categoryLabels[item.category] || item.category,
    },
    { key: 'display_order', header: 'الترتيب' },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: GalleryItem) => (
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
            <ImageIcon className="h-8 w-8 text-secondary" />
            معرض الصور
          </h1>
          <p className="text-muted-foreground mt-1">إدارة صور المعرض</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة صورة
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
        title={editingItem ? 'تعديل صورة' : 'إضافة صورة'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      >
        <ImageUpload
          value={formData.image_url}
          onChange={(url) => setFormData({ ...formData, image_url: url })}
          label="الصورة"
          required
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

        <div className="space-y-2">
          <Label>التصنيف</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tourism">سياحة</SelectItem>
              <SelectItem value="hajj-umrah">حج وعمرة</SelectItem>
              <SelectItem value="hotels">فنادق</SelectItem>
              <SelectItem value="flights">طيران</SelectItem>
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
            <AlertDialogTitle className="text-right">حذف الصورة</AlertDialogTitle>
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

export default Gallery;
