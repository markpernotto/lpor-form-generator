import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";

const resources = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Disable automatic language detection to prevent conflicts
  detection: {
    order: [], // Empty array disables detection
  },

  // Define supported languages
  supportedLngs: ["en", "es", "fr"],
});

export default i18n;

// Export hooks for easier imports
export { useTranslation } from "./hooks/useTranslation";
