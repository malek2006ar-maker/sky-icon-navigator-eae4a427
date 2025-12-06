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
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
];

const announcementTypeOptions = [
  { value: 'news', label: 'News' },
  { value: 'offer', label: 'Special Offer' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'video', label: 'Video' },
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
      header: 'Media',
      render: (item: Announcement) => (
        item.media_url ? (
          item.media_type === 'image' ? (
            <img
              src={item.media_url}
              alt={item.title_en}
              className="w-20 h-12 object-cover rounded"
            />
          ) : (
            <Badge variant="outline">Video</Badge>
          )
        ) : '-'
      ),
    },
    { key: 'title_en', header: 'Title (EN)' },
    {
      key: 'announcement_type',
      header: 'Type',
      render: (item: Announcement) => (
        <Badge variant="outline" className="capitalize">{item.announcement_type}</Badge>
      ),
    },
    { key: 'priority', header: 'Priority' },
    {
      key: 'is_featured',
      header: 'Featured',
      render: (item: Announcement) => (
        item.is_featured ? <Badge className="bg-secondary text-secondary-foreground">Featured</Badge> : '-'
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (item: Announcement) => (
        <Badge variant={item.is_active ? 'default' : 'secondary'}>
          {item.is_active ? 'Active' : 'Inactive'}
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
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">Manage promotional announcements</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Announcement
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
        title={editingItem ? 'Edit Announcement' : 'Add Announcement'}
        onSubmit={handleSubmit}
        isLoading={isCreating || isUpdating}
      >
        <MultilingualInput
          label="Title"
          values={formData.title}
          onChange={(title) => setFormData({ ...formData, title })}
          required
        />
        <MultilingualInput
          label="Description"
          values={formData.description}
          onChange={(description) => setFormData({ ...formData, description })}
          isTextarea
        />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Media Type</Label>
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
            <Label>Announcement Type</Label>
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
          <Label>Media URL</Label>
          <Input
            value={formData.media_url}
            onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
            placeholder={formData.media_type === 'video' ? 'YouTube embed URL' : 'https://example.com/image.jpg'}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <Input
              type="number"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label>Featured</Label>
            <Switch
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
            />
          </div>
          <div className="flex items-center justify-between pt-6">
            <Label>Active</Label>
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.title_en}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Announcements;
