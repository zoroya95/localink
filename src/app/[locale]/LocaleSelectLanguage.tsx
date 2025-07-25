import { useState } from 'react';
import { useChangeLocale, useCurrentLocale, useI18n } from '../../locales/client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../components/ui/hover-card";
import Image from 'next/image';

const languages = [
  { code: 'en', flag: 'gb', name: 'English-EN' },
  { code: 'fr', flag: 'fr', name: 'Français-FR' },
  { code: 'de', flag: 'de', name: 'Deutsch-DE' },
  { code: 'es', flag: 'es', name: 'Español-ES' },
  { code: 'it', flag: 'it', name: 'Italiano-IT' },
  { code: 'pt', flag: 'pt', name: 'Português-PT' }
];

const LocaleSelectLanguage = () => {
  const locale = useCurrentLocale();
  const changeLocale = useChangeLocale();
  const t = useI18n();
  const [changingLocale, setChangingLocale] = useState<string | null>(null);
  
  const currentFlag = languages.find((l) => l.code === locale)?.flag || "gb";

  const handleLocaleChange = (newLocale: any) => {
    setChangingLocale(newLocale);
    changeLocale(newLocale);
    
    setTimeout(() => {
      setChangingLocale(null);
    }, 500);
  };

  return (
    <HoverCard openDelay={0} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-md bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
          <div className="w-6 h-6 relative">
            <Image
              src={`/flags/${currentFlag}.svg`}
              alt={locale}
              fill
              className="rounded-full object-cover"
            />
          </div>

          <span className="text-sm font-medium text-gray-700">
            {t("currentLanguage", )}
          </span>
        </div>
      </HoverCardTrigger>
      
      <HoverCardContent 
        className="w-64 p-2 relative shadow-lg mt-3 border border-gray-200 rounded-lg"
        sideOffset={1}
        align="center"
        side="bottom"
      >
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rotate-45 bg-white border-t border-l border-gray-200 z-10"></div>

        <div className="space-y-1">
          <div className="px-3 pt-2 pb-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
            {t("language.Language")}
          </div>
          
          <div className="space-y-0.5">
            {languages.map(({code, flag, name}) => (
              <div 
                key={code}
                onClick={() => handleLocaleChange(code)}
                className={`flex items-center px-3 py-2 rounded-md cursor-pointer transition-all duration-300 ${
                  locale === code 
                    ? 'bg-gray-100 text-gray-900 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                } ${
                  changingLocale === code ? 'scale-[0.98]' : ''
                }`}
              >
                <span className={`
                  flex items-center justify-center rounded-full transition-all duration-200
                  ${changingLocale === code ? 'h-4 w-4 border-[3px] border-black' : ''}
                  ${locale === code && !changingLocale ? 'h-4 w-4 border-3 border-black' : ''}
                  ${locale !== code && !changingLocale ? 'h-4 w-4 border-2 border-gray-400' : ''}
                `}></span>
                
                <span className={`fi fi-${flag} rounded ml-2`}></span>
                
                <span className="text-sm ml-2">{name}</span>
                
                {changingLocale === code && (
                  <span className="ml-auto h-3 w-3 border-2 border-gray-400 border-t-black animate-spin rounded-full"></span>
                )}
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default LocaleSelectLanguage;
