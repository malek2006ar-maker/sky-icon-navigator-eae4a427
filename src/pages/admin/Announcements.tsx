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
import { Plus, Megaphone } from 'lucide-react';
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
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title_ar: string;
  title_en: string;
  title_fr: string;
  description_ar: string | null;
  description_en: string | null;
  description_fr: string | null;
  media_url: string | null;
  media_type: string;
  announcement_type: string;
  is_featured: boolean;
  priority: number;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

const mediaTypeOptions = [
  { value: 'image', label: 'صورة' },
  { value: 'video', label: 'فيديو' },
];

const announcementTypeOptions = [
  { value: 'news', label: 'أخبار' },
  { value: 'offer', label: 'عرض خاص' },
  { value: 'advertisement', label: 'إعلان' },
  { value: 'video', label: 'فيديو' },
];

const defaultFormData = {
  title: { ar: '', en: '', fr: '' },
  description: { ar: '', en: '', fr: '' },
  media_url: '',
  media_type: 'image',
  announcement_type: 'news',
  is_featured: false,
  priority: 0,
  start_date: '',
  end_date: '',
  is_active: true,
};

const Announcements = () => {
  const { data, isLoading, create, update, delete: deleteItem, isCreating, isUpdating } = useCrudOperations<Announcement>('announcements');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  const handleCreate = () => {
    setEditingItem(null);
    setFormData(defaultFormData);
    setDialogOpen(true);
  };

  const handleEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      title: { ar: item.title_ar, en: item.title_en, fr: item.title_fr },
      description: { ar: item.description_ar || '', en: item.description_en || '', fr: item.description_fr || '' },
      media_url: item.media_url || '',
      media_type: item.media_type,
      announcement_type: item.announcement_type,
      is_featured: item.is_featured,
      priority: item.priority,
      start_date: item.start_date ? format(new Date(item.start_date), 'yyyy-MM-dd') : '',
      end_date: item.end_date ? format(new Date(item.end_date), 'yyyy-MM-dd') : '',
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const handleDelete = (item: Announcement) => {
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

  const handleToggleActive = (item: Announcement) => {
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
      media_url: formData.media_url || null,
      media_type: formData.media_type,
      announcement_type: formData.announcement_type,
      is_featured: formData.is_featured,
      priority: formData.priority,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
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
      key: 'media_url',
      header: 'الوسائط',
      render: (item: Announcement) => (
        item.media_url ? (
          item.media_type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title_ar}
              className="w-20 h-12 object-cover rounded"
            />
          ) : (
            <Badge variant="outline">فيديو</Badge>
          )
        ) : '-'
      ),
    },
    { key: 'title_ar', header: 'العنوان' },
    {
      key: 'announcement_type',
      header: 'النوع',
      render: (item: Announcement) => (
        <Badge variant="outline">{announcementTypeOptions.find(o => o.value === item.announcement_type)?.label || item.announcement_type}</Badge>
      ),
    },
    { key: 'priority', header: 'الأولوية' },
    {
      key: 'is_featured',
      header: 'مميز',
      render: (item: Announcement) => (
        item.is_featured ? <Badge className="bg-secondary text-secondary-foreground">مميز</Badge> : '-'
      ),
    },
    {
      key: 'is_active',
      header: 'الحالة',
      render: (item: Announcement) => (
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
            <Megaphone className="h-8 w-8 text-secondary" />
            الإعلانات
          </h1>
          <p className="text-muted-foreground mt-1">إدارة الإعلانات الترويجية</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة إعلان
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
        title={editingItem ? 'تعديل الإعلان' : 'إضافة إعلان'}
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
            <Label>نوع الوسائط</Label>
            <Select value={formData.media_type} onValueChange={(media_type) => setFormData({ ...formData, media_type })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mediaTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>نوع الإعلان</Label>
            <Select value={formData.announcement_type} onValueChange={(announcement_type) => setFormData({ ...formData, announcement_type })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {announcementTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>رابط الوسائط</Label>
          <Input
            value={formData.media_url}
            onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
            placeholder={formData.media_type === 'video' ? 'رابط فيديو يوتيوب' : 'https://example.com/image.jpg'}
            dir="ltr"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>تاريخ البدء</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>تاريخ الانتهاء</Label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>الأولوية</Label>
            <Input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
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
            <AlertDialogTitle className="text-right">حذف الإعلان</AlertDialogTitle>
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

export default Announcements;
