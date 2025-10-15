import React from "react";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

export const LanguageSelector: React.FC = () => {
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

  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      <span className="text-sm text-gray-600">
        Language:
      </span>
      <select
        value={currentLanguage}
        onChange={(e) => {
          console.log(e.target.value);
          handleLanguageChange(e.target.value);
        }}
        className="px-3 py-1 border border-gray-300 rounded text-sm bg-white"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};
