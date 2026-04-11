import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
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
import { Send, User, Phone, Users, MessageSquare } from 'lucide-react';

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
    submit: 'إرسال عبر واتساب',
    package: 'الباقة',
    price: 'السعر',
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
    submit: 'Send via WhatsApp',
    package: 'Package',
    price: 'Price',
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
    submit: 'Envoyer via WhatsApp',
    package: 'Forfait',
    price: 'Prix',
  },
};

export const BookingDialog = ({ open, onOpenChange, packageTitle, packagePrice }: BookingDialogProps) => {
  const { language, isRTL } = useLanguage();
  const { settings } = useSiteSettings();
  const t = labels[language];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [travelers, setTravelers] = useState('1');
  const [notes, setNotes] = useState('');

  const whatsappNumber = settings.contact.whatsapp?.replace(/\D/g, '') || '967783003636';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = isRTL
      ? `✈️ *طلب حجز جديد*\n\n📦 الباقة: ${packageTitle}\n💰 السعر: ${packagePrice || '-'}\n👤 الاسم: ${name}\n📞 الهاتف: ${phone}\n👥 عدد المسافرين: ${travelers}\n📝 ملاحظات: ${notes || 'لا يوجد'}\n\n🌐 Sky Icon Travel`
      : `✈️ *New Booking Request*\n\n📦 Package: ${packageTitle}\n💰 Price: ${packagePrice || '-'}\n👤 Name: ${name}\n📞 Phone: ${phone}\n👥 Travelers: ${travelers}\n📝 Notes: ${notes || 'None'}\n\n🌐 Sky Icon Travel`;

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    onOpenChange(false);
    setName('');
    setPhone('');
    setTravelers('1');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-playfair">{t.title}</DialogTitle>
        </DialogHeader>

        {/* Package Info */}
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
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone size={14} />
              {t.phone}
            </Label>
            <Input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users size={14} />
              {t.travelers}
            </Label>
            <Input
              required
              type="number"
              min="1"
              max="50"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              placeholder={t.travelersPlaceholder}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MessageSquare size={14} />
              {t.notes}
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full gap-2">
            <Send size={16} />
            {t.submit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
