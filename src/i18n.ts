import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import zh from './locales/zh.json';
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      fr: { translation: fr },
      it: { translation: it },
      zh: { translation: zh },
    },
    lng: localStorage.getItem('language') ?? 'en', // Default to 'en' if no language is in localStorage
    fallbackLng: 'en', // Fallback language if the detected one is unavailable
    interpolation: { escapeValue: false }, // React already escapes
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
