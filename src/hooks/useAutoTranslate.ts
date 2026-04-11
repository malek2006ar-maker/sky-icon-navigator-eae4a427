import { useCallback, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MultilingualValue {
  ar: string;
  en: string;
  fr: string;
}

export function useAutoTranslate() {
  const { toast } = useToast();
  const [translating, setTranslating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const translateText = useCallback(async (arabicText: string): Promise<{ en: string; fr: string } | null> => {
    if (!arabicText.trim()) return null;
    
    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text: arabicText, targetLanguages: ['en', 'fr'] }
      });

      if (error) throw error;

      if (data?.translations) {
        toast({
          title: 'تمت الترجمة',
          description: 'تم ترجمة النص للإنجليزية والفرنسية تلقائياً',
        });
        return data.translations;
      }
      return null;
    } catch (error: any) {
      console.error('Translation error:', error);
      return null;
    } finally {
      setTranslating(false);
    }
  }, [toast]);

  const createTranslateHandler = useCallback(<T extends Record<string, any>>(
    fieldName: string,
    setFormData: React.Dispatch<React.SetStateAction<T>>
  ) => {
    return (values: MultilingualValue) => {
      setFormData(prev => ({ ...prev, [fieldName]: values }));

      // Auto-translate when Arabic text changes and other fields are empty
      if (values.ar.trim() && !values.en && !values.fr) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        timeoutRef.current = setTimeout(async () => {
          const translations = await translateText(values.ar);
          if (translations) {
            setFormData(prev => ({
              ...prev,
              [fieldName]: {
                ...(prev[fieldName] as MultilingualValue),
                en: translations.en || (prev[fieldName] as MultilingualValue).en,
                fr: translations.fr || (prev[fieldName] as MultilingualValue).fr,
              }
            }));
          }
        }, 1000);
      }
    };
  }, [translateText]);

  return { translating, translateText, createTranslateHandler };
}
