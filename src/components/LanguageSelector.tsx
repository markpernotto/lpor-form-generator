import React from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { AccessibleSelect } from "./AccessibleSelect";
import { useTranslation } from "../i18n/hooks/useTranslation";

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();

  const currentLanguage = lang || "en";

  const handleLanguageChange = (
    newLang: string,
  ) => {
    // Get the current pathname and replace the language part
    const pathParts =
      location.pathname.split("/");

    // If the path starts with a language code, replace it
    if (
      pathParts[1] &&
      (pathParts[1] === "en" ||
        pathParts[1] === "es" ||
        pathParts[1] === "fr")
    ) {
      pathParts[1] = newLang;
    } else {
      // If no language in path, add it
      pathParts.splice(1, 0, newLang);
    }

    const newPath = pathParts.join("/");
    navigate(newPath);
  };

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
  ];

  return (
    <div className="w-48">
      <AccessibleSelect
        id="language-selector"
        label={t("common.language")}
        value={currentLanguage}
        onChange={handleLanguageChange}
        options={languageOptions}
      />
    </div>
  );
};
