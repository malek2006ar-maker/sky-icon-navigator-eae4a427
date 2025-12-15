import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { compressImage } from '@/lib/imageCompression';
import { Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  label?: string;
  required?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = 'gallery',
  label = 'الصورة',
  required = false,
}) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار ملف صورة صالح',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      // Compress image before upload
      const compressedBlob = await compressImage(file);
      const fileName = `${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, compressedBlob, {
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast({
        title: 'تم الرفع',
        description: 'تم رفع الصورة وضغطها بنجاح',
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'خطأ',
        description: error.message || 'فشل رفع الصورة',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <>
                <ImageIcon className="w-10 h-10 mb-3 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  اضغط لرفع صورة (أي حجم)
                </p>
                <p className="text-xs text-muted-foreground">
                  سيتم ضغط الصورة تلقائياً
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
