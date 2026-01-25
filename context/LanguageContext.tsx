/**
 * Language Context - Skipline Go
 * React Context for multi-language support
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  Translations, 
  getStoredLanguage, 
  setStoredLanguage, 
  getTranslations 
} from '../services/languageService';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage());
  const [t, setT] = useState<Translations>(getTranslations(language));

  useEffect(() => {
    setT(getTranslations(language));
  }, [language]);

  const setLanguage = (lang: Language) => {
    setStoredLanguage(lang);
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
