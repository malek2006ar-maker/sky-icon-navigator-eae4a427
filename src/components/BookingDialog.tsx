import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, User, Phone, Users, MessageSquare, Check } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageTitle: string;
  packagePrice?: string;
}

const labels = {
  ar: {
    title: 'نموذج الحجز',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    travelers: 'عدد المسافرين',
    notes: 'ملاحظات إضافية',
    namePlaceholder: 'أدخل اسمك الكامل',
    phonePlaceholder: 'مثال: 967783003636+',
    travelersPlaceholder: 'عدد الأشخاص',
    notesPlaceholder: 'أي طلبات خاصة أو ملاحظات...',
    submit: 'إرسال الحجز',
    sendWhatsapp: 'إرسال عبر واتساب أيضاً',
    package: 'الباقة',
    price: 'السعر',
    success: 'تم إرسال الحجز بنجاح!',
    successDesc: 'سنتواصل معك قريباً لتأكيد الحجز',
    error: 'حدث خطأ أثناء إرسال الحجز',
  },
  en: {
    title: 'Booking Form',
    name: 'Full Name',
    phone: 'Phone Number',
    travelers: 'Number of Travelers',
    notes: 'Additional Notes',
    namePlaceholder: 'Enter your full name',
    phonePlaceholder: 'e.g. +967783003636',
    travelersPlaceholder: 'Number of people',
    notesPlaceholder: 'Any special requests or notes...',
    submit: 'Submit Booking',
    sendWhatsapp: 'Also send via WhatsApp',
    package: 'Package',
    price: 'Price',
    success: 'Booking submitted successfully!',
    successDesc: 'We will contact you soon to confirm',
    error: 'Error submitting booking',
  },
  fr: {
    title: 'Formulaire de réservation',
    name: 'Nom complet',
    phone: 'Numéro de téléphone',
    travelers: 'Nombre de voyageurs',
    notes: 'Notes supplémentaires',
    namePlaceholder: 'Entrez votre nom complet',
    phonePlaceholder: 'ex: +967783003636',
    travelersPlaceholder: 'Nombre de personnes',
    notesPlaceholder: 'Demandes spéciales ou notes...',
    submit: 'Soumettre la réservation',
    sendWhatsapp: 'Envoyer aussi via WhatsApp',
    package: 'Forfait',
    price: 'Prix',
    success: 'Réservation soumise avec succès!',
    successDesc: 'Nous vous contacterons bientôt pour confirmer',
    error: 'Erreur lors de la soumission',
  },
};

export const BookingDialog = ({ open, onOpenChange, packageTitle, packagePrice }: BookingDialogProps) => {
  const { language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const t = labels[language];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [notes, setNotes] = useState('');
  const [sendWhatsapp, setSendWhatsapp] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const whatsappNumber = settings.contact.whatsapp?.replace(/\D/g, '') || '967783003636';

  const resetForm = () => {
    setName('');
    setPhone('');
    setTravelers('1');
    setNotes('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase.from('bookings').insert({
        customer_name: name,
        customer_phone: phone,
        travelers_count: parseInt(travelers) || 1,
        package_title: packageTitle,
        package_price: packagePrice || null,
        notes: notes || null,
      });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.successDesc,
      });

      if (sendWhatsapp) {
        const message = isRTL
          ? `✈️ *طلب حجز جديد*\n\n📦 الباقة: ${packageTitle}\n💰 السعر: ${packagePrice || '-'}\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n👥 عدد المسافرين: ${travelers}\n📝 ملاحظات: ${notes || 'لا يوجد'}\n\n🌐 Sky Icon Travel`
          : `✈️ *New Booking Request*\n\n📦 Package: ${packageTitle}\n💰 Price: ${packagePrice || '-'}\n👤 Name: ${name}\n📞 Phone: ${phone}\n👥 Travelers: ${travelers}\n📝 Notes: ${notes || 'None'}\n\n🌐 Sky Icon Travel`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }

      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error('Booking error:', err);
      toast({
        title: t.error,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-playfair">{t.title}</DialogTitle>
        </DialogHeader>

        <div className="bg-muted rounded-lg p-3 flex items-center justify-between text-sm">
          <span className="font-semibold text-foreground">{packageTitle}</span>
          {packagePrice && <span className="text-secondary font-bold ltr-nums">{packagePrice}</span>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User size={14} />
              {t.name}
            </Label>
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder={t.namePlaceholder} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone size={14} />
              {t.phone}
            </Label>
            <Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.phonePlaceholder} dir="ltr" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users size={14} />
              {t.travelers}
            </Label>
            <Input required type="number" min="1" max="50" value={travelers} onChange={(e) => setTravelers(e.target.value)} placeholder={t.travelersPlaceholder} dir="ltr" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare size={14} />
              {t.notes}
            </Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesPlaceholder} rows={3} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={sendWhatsapp}
              onChange={(e) => setSendWhatsapp(e.target.checked)}
              className="rounded"
            />
            {t.sendWhatsapp}
          </label>

          <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full gap-2">
            {submitting ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {t.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
