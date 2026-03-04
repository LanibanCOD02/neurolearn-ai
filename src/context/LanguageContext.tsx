import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ta' | 'hi' | 'te' | 'ml' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  simplify: boolean;
  setSimplify: (simplify: boolean) => void;
  localize: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const languages: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
];

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [simplify, setSimplify] = useState(false);
  const [cache, setCache] = useState<Record<string, string>>({});

  const localize = async (text: string): Promise<string> => {
    if (language === 'en' && !simplify) return text;

    const cacheKey = `${language}-${simplify}-${text}`;
    if (cache[cacheKey]) return cache[cacheKey];

    try {
      const response = await fetch('/api/localize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang: languages.find(l => l.code === language)?.name, simplify }),
      });
      
      if (!response.ok) throw new Error('Localization failed');
      
      const data = await response.json();
      const translated = data.translatedText;
      
      setCache(prev => ({ ...prev, [cacheKey]: translated }));
      return translated;
    } catch (error) {
      console.error(error);
      return text; // Fallback to original
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, simplify, setSimplify, localize }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
