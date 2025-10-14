import React from "react";
import { useParams } from "react-router-dom";
import { LPORFForm } from "../forms/lpor_f/LPORFForm";
import { LanguageSelector } from "../components/LanguageSelector";
import { downloadLPORFPDF } from "../forms/lpor_f/pdfGenerator";
import type { LPORFFormData } from "../forms/lpor_f/formTypes";
import { useTranslation } from "../i18n/hooks/useTranslation";

export const LPORFPage: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { changeLanguage } = useTranslation();

  // Update language when URL parameter changes
  React.useEffect(() => {
    if (
      lang &&
      (lang === "en" || lang === "es")
    ) {
      changeLanguage(lang);
    } else {
      // Default to English for unsupported languages
      changeLanguage("en");
    }
  }, [lang]); // Only depend on lang, not changeLanguage

  const handleFormSubmit = (
    data: LPORFFormData,
  ) => {
    console.log("LPOR-F Form submitted:", data);

    // Generate and download PDF
    try {
      downloadLPORFPDF(data);
    } catch (error) {
      console.error(
        "Error generating PDF:",
        error,
      );
      alert(
        "Error generating PDF. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-end">
          <LanguageSelector />
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <LPORFForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};
