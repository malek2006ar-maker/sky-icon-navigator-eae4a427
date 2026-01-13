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
import { Plus, BarChart3 } from 'lucide-react';
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

interface Stat {
  id: string;
  label_ar: string;
  label_en: string;
  label_fr: string;
  value: number;
  icon: string;
  suffix_ar: string | null;
  suffix_en: string | null;
  suffix_fr: string | null;
  display_order: number;
  is_active: boolean;
}

const iconOptions = [
  { value: 'users', label: 'مستخدمين' },
  { value: 'plane', label: 'طائرة' },
  { value: 'globe', label: 'كرة أرضية' },
  { value: 'award', label: 'جائزة' },
];

const defaultFormData = {
  label: { ar: '', en: '', fr: '' },
  suffix: { ar: '+', en: '+', fr: '+' },
  value: 0,
  icon: 'users',
  display_order: 0,
  is_active: true,
};

const Stats = () => {
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<Stat>('stats');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Stat | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Stat | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: Stat) => {
    setEditingItem(item);
    setFormData({
      label: { ar: item.label_ar, en: item.label_en, fr: item.label_fr },
      suffix: { ar: item.suffix_ar || '', en: item.suffix_en || '', fr: item.suffix_fr || '' },
      value: item.value,
      icon: item.icon,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Stat) => {
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

  const handleToggleActive = (item: Stat) => {
    update({ id: item.id, is_active: !item.is_active });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      label_ar: formData.label.ar || 'بدون تسمية',
      label_en: formData.label.en || 'Untitled',
      label_fr: formData.label.fr || 'Sans titre',
      suffix_ar: formData.suffix.ar || null,
      suffix_en: formData.suffix.en || null,
      suffix_fr: formData.suffix.fr || null,
      value: formData.value,
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
      render: (item: Stat) => (
        <Badge variant="outline">{iconOptions.find(o => o.value === item.icon)?.label || item.icon}</Badge>
      ),
    },
    { key: 'label_ar', header: 'التسمية' },
    { key: 'value', header: 'القيمة' },
    { key: 'display_order', header: 'الترتيب' },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: Stat) => (
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
            <BarChart3 className="h-8 w-8 text-secondary" />
            الإحصائيات
          </h1>
          <p className="text-muted-foreground mt-1">إدارة إحصائيات الموقع</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة إحصائية
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
        title={editingItem ? 'تعديل الإحصائية' : 'إضافة إحصائية'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      >
        <MultilingualInput
          label="التسمية"
          values={formData.label}
          onChange={(values) => setFormData({ ...formData, label: values })}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>القيمة</Label>
            <Input
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
            />
          </div>
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
        </div>

        <MultilingualInput
          label="اللاحقة (مثل: +)"
          values={formData.suffix}
          onChange={(values) => setFormData({ ...formData, suffix: values })}
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
            <AlertDialogTitle className="text-right">حذف الإحصائية</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              هل أنت متأكد من حذف "{itemToDelete?.label_ar}"؟ لا يمكن التراجع عن هذا الإجراء.
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

export default Stats;