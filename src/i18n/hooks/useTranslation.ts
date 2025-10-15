import { useTranslation as useReactI18nextTranslation } from "react-i18next";
import { useCallback } from "react";

export const useTranslation = () => {
  const { t, i18n } =
    useReactI18nextTranslation();

  const changeLanguage = useCallback(
    (lng: string) => {
      return i18n.changeLanguage(lng);
    },
    [i18n],
  );

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage,
  };
};
