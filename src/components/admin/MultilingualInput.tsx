import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MultilingualInputProps {
  label: string;
  values: {
    ar: string;
    en: string;
    fr: string;
  };
  onChange: (values: { ar: string; en: string; fr: string }) => void;
  isTextarea?: boolean;
  required?: boolean;
}

const MultilingualInput: React.FC<MultilingualInputProps> = ({
  label,
  values,
  onChange,
  isTextarea = false,
  required = false,
}) => {
  const InputComponent = isTextarea ? Textarea : Input;

  const handleChange = (lang: 'ar' | 'en' | 'fr', value: string) => {
    onChange({ ...values, [lang]: value });
  };

  return (
    <div className="space-y-2">
      <Label>{label} {required && <span className="text-destructive">*</span>}</Label>
      <Tabs defaultValue="ar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ar">العربية</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="fr">Français</TabsTrigger>
        </TabsList>
        <TabsContent value="ar">
          <InputComponent
            value={values.ar}
            onChange={(e) => handleChange('ar', e.target.value)}
            dir="rtl"
            placeholder={`${label} (عربي) - سيتم الترجمة تلقائياً`}
          />
        </TabsContent>
        <TabsContent value="en">
          <InputComponent
            value={values.en}
            onChange={(e) => handleChange('en', e.target.value)}
            dir="ltr"
            placeholder={`${label} (English) - ترجمة تلقائية`}
          />
        </TabsContent>
        <TabsContent value="fr">
          <InputComponent
            value={values.fr}
            onChange={(e) => handleChange('fr', e.target.value)}
            dir="ltr"
            placeholder={`${label} (Français) - ترجمة تلقائية`}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultilingualInput;
