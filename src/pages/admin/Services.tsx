import React, { useState } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import { useAutoTranslate } from '@/hooks/useAutoTranslate';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import MultilingualInput from '@/components/admin/MultilingualInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Loader2 } from 'lucide-react';
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

interface Service {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  icon: string;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: 'plane', label: 'طائرة' },
  { value: 'hotel', label: 'فندق' },
  { value: 'passport', label: 'جواز سفر / تأشيرة' },
  { value: 'map', label: 'خريطة / جولات' },
  { value: 'mosque', label: 'مسجد / حج' },
  { value: 'headphones', label: 'استشارات' },
];

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  icon: 'plane',
  display_order: 0,
  is_active: true,
};

const Services = () => {
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<Service>('services');
  const { translating, createTranslateHandler } = useAutoTranslate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Service | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleTitleChange = createTranslateHandler('title', setFormData);
  const handleDescriptionChange = createTranslateHandler('description', setFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: Service) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      description: { ar: item.description_ar || '', en: item.description_en || '', fr: item.description_fr || '' },
      icon: item.icon,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Service) => {
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

  const handleToggleActive = (item: Service) => {
    update({ id: item.id, is_active: !item.is_active });
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
      icon: formData.icon,
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
      key: 'icon',
      header: 'الأيقونة',
      render: (item: Service) => (
        <Badge variant="outline">{iconOptions.find(o => o.value === item.icon)?.label || item.icon}</Badge>
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    { key: 'display_order', header: 'الترتيب' },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: Service) => (
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
            <Settings className="h-8 w-8 text-secondary" />
            الخدمات
          </h1>
          <p className="text-muted-foreground mt-1">إدارة خدماتك المقدمة</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة خدمة
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
        title={editingItem ? 'تعديل الخدمة' : 'إضافة خدمة'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
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
          <Label>الأيقونة</Label>
          <Select value={formData.icon} onValueChange={(icon) => setFormData({ ...formData, icon })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {iconOptions.map((option) => (
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
            <AlertDialogTitle className="text-right">حذف الخدمة</AlertDialogTitle>
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

export default Services;
