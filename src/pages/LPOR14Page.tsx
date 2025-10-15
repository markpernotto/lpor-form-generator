import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LPORForm } from "../forms/lpor14/LPORForm";
import { LPORPDFGenerator } from "../forms/lpor14/pdfGenerator";
import type { LPORFormSchema } from "../forms/lpor14/formSchema";
import { useTranslation } from "../i18n";
import { LanguageSelector } from "../components/LanguageSelector";

export const LPOR14Page: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  console.log("Current lang:", lang);
  const { changeLanguage } = useTranslation();

  // Update language when URL parameter changes
  useEffect(() => {
    if (
      lang &&
      (lang === "en" ||
        lang === "es" ||
        lang === "fr")
    ) {
      changeLanguage(lang);
    } else {
      // Default to English for unsupported languages
      changeLanguage("en");
    }
  }, [lang, changeLanguage]); // Include changeLanguage in dependencies

  const handleFormSubmit = async (
    data: LPORFormSchema,
  ) => {
    console.log(
      "Form submitted with data:",
      data,
    );

    try {
      // Generate PDF
      const pdfGenerator = new LPORPDFGenerator();
      const pdfBytes =
        await pdfGenerator.generatePDF(data);

      // Create download link
      const blob = new Blob(
        [pdfBytes as BlobPart],
        {
          type: "application/pdf",
        },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "LPOR_14_Form.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Error generating PDF:",
        error,
      );
      alert(
        "Error generating PDF. Please check the console for details.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <LanguageSelector />
        <LPORForm onSubmit={handleFormSubmit} />
      </div>
    </div>
  );
};
