import React, { useState } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import MultilingualInput from '@/components/admin/MultilingualInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package } from 'lucide-react';
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

interface PackageItem {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  price: string;
  duration_ar: string;
  duration_en: string;
  duration_fr: string;
  image_url: string;
  features_ar: string[] | null;
  features_en: string[] | null;
  features_fr: string[] | null;
  category: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const categoryOptions = [
  { value: 'hajj', label: 'حج' },
  { value: 'umrah', label: 'عمرة' },
  { value: 'tourism', label: 'سياحة' },
];

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  duration: { ar: '', en: '', fr: '' },
  price: '',
  image_url: '',
  features: { ar: '', en: '', fr: '' },
  category: 'tourism',
  is_featured: false,
  is_active: true,
  display_order: 0,
};

const Packages = () => {
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<PackageItem>('packages');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PackageItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<PackageItem | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: PackageItem) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      description: { ar: item.description_ar || '', en: item.description_en || '', fr: item.description_fr || '' },
      duration: { ar: item.duration_ar, en: item.duration_en, fr: item.duration_fr },
      price: item.price,
      image_url: item.image_url,
      features: {
        ar: (item.features_ar || []).join('\n'),
        en: (item.features_en || []).join('\n'),
        fr: (item.features_fr || []).join('\n'),
      },
      category: item.category,
      is_featured: item.is_featured,
      is_active: item.is_active,
      display_order: item.display_order,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: PackageItem) => {
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

  const handleToggleActive = (item: PackageItem) => {
    update({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title_ar: formData.title.ar,
      title_en: formData.title.en,
      title_fr: formData.title.fr,
      description_ar: formData.description.ar || null,
      description_en: formData.description.en || null,
      description_fr: formData.description.fr || null,
      duration_ar: formData.duration.ar,
      duration_en: formData.duration.en,
      duration_fr: formData.duration.fr,
      price: formData.price,
      image_url: formData.image_url,
      features_ar: formData.features.ar.split('\n').filter(Boolean),
      features_en: formData.features.en.split('\n').filter(Boolean),
      features_fr: formData.features.fr.split('\n').filter(Boolean),
      category: formData.category,
      is_featured: formData.is_featured,
      is_active: formData.is_active,
      display_order: formData.display_order,
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
      render: (item: PackageItem) => (
        <img
          src={item.image_url}
          alt={item.title_ar}
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    { key: 'price', header: 'السعر' },
    {
      key: 'category',
      header: 'الفئة',
      render: (item: PackageItem) => (
        <Badge variant="outline">{categoryOptions.find(o => o.value === item.category)?.label || item.category}</Badge>
      ),
    },
    {
      key: 'is_featured',
      header: 'مميز',
      render: (item: PackageItem) => (
        item.is_featured ? <Badge className="bg-secondary text-secondary-foreground">مميز</Badge> : '-'
      ),
    },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: PackageItem) => (
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
            <Package className="h-8 w-8 text-secondary" />
            الباقات
          </h1>
          <p className="text-muted-foreground mt-1">إدارة باقات السفر</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة باقة
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
        title={editingItem ? 'تعديل الباقة' : 'إضافة باقة'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      >
        <MultilingualInput
          label="العنوان"
          values={formData.title}
          onChange={(title) => setFormData({ ...formData, title })}
          required
        />
        <MultilingualInput
          label="الوصف"
          values={formData.description}
          onChange={(description) => setFormData({ ...formData, description })}
          isTextarea
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>السعر <span className="text-destructive">*</span></Label>
            <Input
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="$999"
              required
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label>الفئة</Label>
            <Select value={formData.category} onValueChange={(category) => setFormData({ ...formData, category })}>
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
        </div>
        <MultilingualInput
          label="المدة"
          values={formData.duration}
          onChange={(duration) => setFormData({ ...formData, duration })}
          required
        />
        <div className="space-y-2">
          <Label>رابط الصورة <span className="text-destructive">*</span></Label>
          <Input
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
            dir="ltr"
          />
        </div>
        <MultilingualInput
          label="المميزات (واحدة في كل سطر)"
          values={formData.features}
          onChange={(features) => setFormData({ ...formData, features })}
          isTextarea
        />
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>ترتيب العرض</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label>مميز</Label>
            <Switch
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
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
            <AlertDialogTitle className="text-right">حذف الباقة</AlertDialogTitle>
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

export default Packages;
