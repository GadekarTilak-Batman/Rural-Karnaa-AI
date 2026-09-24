import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode } from '../types';
import { StorageService } from '../services/storage';
import { t as translateFn, SUPPORTED_LANGUAGES } from '../locales/translations';

interface LanguageContextType {
  lang: LanguageCode;
  setLanguage: (newLang: LanguageCode) => void;
  t: (key: string, overrideLang?: LanguageCode) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<LanguageCode>(() => StorageService.getLanguage());

  useEffect(() => {
    // Sync language state whenever StorageService updates or setLanguage is called
    const unsub = StorageService.subscribe(() => {
      const current = StorageService.getLanguage();
      setLang(current);
    });
    return unsub;
  }, []);

  const handleSetLanguage = (newLang: LanguageCode) => {
    StorageService.setLanguage(newLang);
    setLang(newLang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
    }
  };

  const t = (key: string, overrideLang?: LanguageCode) => translateFn(key, overrideLang || lang);

  return (
    <LanguageContext.Provider value={{ lang, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
