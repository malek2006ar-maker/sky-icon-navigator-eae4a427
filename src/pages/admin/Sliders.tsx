import React, { useState } from 'react';
import { useCrudOperations } from '@/hooks/useCrudOperations';
import DataTable from '@/components/admin/DataTable';
import FormDialog from '@/components/admin/FormDialog';
import MultilingualInput from '@/components/admin/MultilingualInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Images } from 'lucide-react';
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Slider | null>(null);
  const [itemToDelete, setItemToDelete] = useState<Slider | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

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
      title_ar: formData.title.ar,
      title_en: formData.title.en,
      title_fr: formData.title.fr,
      subtitle_ar: formData.subtitle.ar || null,
      subtitle_en: formData.subtitle.en || null,
      subtitle_fr: formData.subtitle.fr || null,
      button_text_ar: formData.button_text.ar || null,
      button_text_en: formData.button_text.en || null,
      button_text_fr: formData.button_text.fr || null,
      image_url: formData.image_url,
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
      header: 'Image',
      render: (item: Slider) => (
        <img
          src={item.image_url}
          alt={item.title_en}
          className="w-20 h-12 object-cover rounded"
        />
      ),
    },
    { key: 'title_en', header: 'Title (EN)' },
    { key: 'display_order', header: 'Order' },
    {
      key: 'is_active',
      header: 'Status',
      render: (item: Slider) => (
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
            <Images className="h-8 w-8 text-secondary" />
            Sliders
          </h1>
          <p className="text-muted-foreground mt-1">Manage homepage hero sliders</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Slider
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
        title={editingItem ? 'Edit Slider' : 'Add Slider'}
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
          label="Subtitle"
          values={formData.subtitle}
          onChange={(subtitle) => setFormData({ ...formData, subtitle })}
        />
        <div className="space-y-2">
          <Label>Image URL <span className="text-destructive">*</span></Label>
          <Input
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <MultilingualInput
          label="Button Text"
          values={formData.button_text}
          onChange={(button_text) => setFormData({ ...formData, button_text })}
        />
        <div className="space-y-2">
          <Label>Button Link</Label>
          <Input
            value={formData.button_link}
            onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
            placeholder="#packages"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
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
            <AlertDialogTitle>Delete Slider</AlertDialogTitle>
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

export default Sliders;
