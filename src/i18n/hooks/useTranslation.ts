import { useTranslation as useReactI18nextTranslation } from "react-i18next";

export const useTranslation = () => {
  const { t, i18n } =
    useReactI18nextTranslation();

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: (lng: string) =>
      i18n.changeLanguage(lng),
  };
};
