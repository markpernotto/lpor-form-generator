import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translation files
import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // URL-based language detection settings
    detection: {
      order: [
        "path",
        "localStorage",
        "navigator",
      ],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },

    // Define supported languages
    supportedLngs: ["en", "es"],
  });

export default i18n;

// Export hooks for easier imports
export { useTranslation } from "./hooks/useTranslation";
