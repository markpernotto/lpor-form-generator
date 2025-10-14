import React from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

export const LanguageSelector: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const currentLanguage = lang || "en";

  const handleLanguageChange = (
    newLang: string,
  ) => {
    // Navigate to the same route but with different language
    navigate(`/${newLang}/lpor14`);
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
      </select>
    </div>
  );
};
