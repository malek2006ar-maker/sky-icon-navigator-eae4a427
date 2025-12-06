import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';

interface LanguageToggleProps {
  isScrolled?: boolean;
}

export const LanguageToggle = ({ isScrolled = false }: LanguageToggleProps) => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'ar', label: 'ع' },
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <div className="flex items-center gap-1 bg-card/20 backdrop-blur-sm rounded-full p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            language === lang.code
              ? 'bg-secondary text-secondary-foreground shadow-sm'
              : isScrolled
              ? 'text-foreground hover:bg-muted'
              : 'text-primary-foreground hover:bg-primary-foreground/20'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
