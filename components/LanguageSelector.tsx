/**
 * Language Selector Component - Skipline Go
 * Allows users to switch between English, Marathi, and Hindi
 */

import React, { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../services/languageService';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark';
  showLabel?: boolean;
}

const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'light',
  showLabel = true 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const baseClasses = variant === 'dark' 
    ? 'bg-white/10 hover:bg-white/20 text-white border-white/20'
    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm';

  const dropdownClasses = variant === 'dark'
    ? 'bg-slate-800 border-slate-700'
    : 'bg-white border-slate-200 shadow-xl';

  const itemHoverClasses = variant === 'dark'
    ? 'hover:bg-white/10'
    : 'hover:bg-slate-50';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${baseClasses}`}
      >
        <Globe className="w-4 h-4" />
        {showLabel && (
          <span className="text-sm font-medium">{currentLang.nativeName}</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown - Opens upward */}
          <div className={`absolute right-0 bottom-full mb-2 w-48 rounded-xl border overflow-hidden z-50 ${dropdownClasses}`}>
            <div className={`px-3 py-2 border-b ${variant === 'dark' ? 'border-slate-700' : 'border-slate-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-wider ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.language.selectLanguage}
              </p>
            </div>
            
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center gap-3 px-3 py-3 transition-colors ${itemHoverClasses} ${
                  language === lang.code 
                    ? variant === 'dark' ? 'bg-amber-500/20' : 'bg-amber-50'
                    : ''
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${variant === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {lang.nativeName}
                  </p>
                  <p className={`text-xs ${variant === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {lang.name}
                  </p>
                </div>
                {language === lang.code && (
                  <Check className="w-5 h-5 text-amber-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
