/**
 * PDF Download Modal Component
 *
 * Displays form generation progress and provides download options for completed PDFs.
 * Shows which forms will be generated based on user's input and allows downloading
 * individual forms or the complete package.
 */

import React, { useState } from "react";
import { useFormState } from "../contexts/FormStateContext";
import {
  generatePDFPackage,
  downloadPDF,
  downloadAllPDFs,
  determineRequiredForms,
  getFormName,
  getFormDescription,
  type FormType,
  type PDFPackage,
} from "../utils/pdfOrchestrator";

interface PDFDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GenerationState =
  | "ready"
  | "generating"
  | "complete"
  | "error";

export const PDFDownloadModal: React.FC<
  PDFDownloadModalProps
> = ({ isOpen, onClose }) => {
  const { formData } = useFormState();
  const [state, setState] =
    useState<GenerationState>("ready");
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
  });
  const [currentForm, setCurrentForm] =
    useState<FormType | null>(null);
  const [pdfPackage, setPdfPackage] =
    useState<PDFPackage | null>(null);
  const [error, setError] = useState<
    string | null
  >(null);

  const requiredForms =
    determineRequiredForms(formData);

  const handleGenerate = async () => {
    setState("generating");
    setError(null);

    try {
      const result = await generatePDFPackage(
        formData,
        (current, total, formType) => {
          setProgress({ current, total });
          setCurrentForm(formType);
        },
      );

      setPdfPackage(result);

      if (result.failureCount > 0) {
        setState("error");
        setError(
          `${result.failureCount} form(s) failed to generate. See details below.`,
        );
      } else {
        setState("complete");
      }
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : "Unknown error occurred",
      );
    }
  };

  const handleDownloadSingle = (
    formType: FormType,
  ) => {
    if (!pdfPackage) return;

    const form = pdfPackage.forms.find(
      (f) => f.formType === formType,
    );
    if (form && form.success) {
      downloadPDF(form.fileName, form.pdfData);
    }
  };

  const handleDownloadAll = async () => {
    if (!pdfPackage) return;
    await downloadAllPDFs(pdfPackage);
  };

  const handleClose = () => {
    setState("ready");
    setProgress({ current: 0, total: 0 });
    setCurrentForm(null);
    setPdfPackage(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-modal-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id="pdf-modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Generate Court Forms
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {state === "ready" && (
            <>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Based on your responses, the
                following forms will be generated:
              </p>

              <div className="space-y-3 mb-6">
                {requiredForms.map((formType) => (
                  <div
                    key={formType}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-md flex items-center justify-center font-bold">
                        {formType}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {getFormName(formType)}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {getFormDescription(
                            formType,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md mb-6">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Important:</strong>{" "}
                  Review your information before
                  generating. You can make changes
                  by going back to the form
                  sections.
                </p>
              </div>
            </>
          )}

          {state === "generating" && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Generating your court forms...
              </p>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>
                    Form {progress.current} of{" "}
                    {progress.total}
                  </span>
                  <span>
                    {currentForm &&
                      `Generating ${getFormName(currentForm)}`}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-300 ease-out"
                    style={{
                      width: `${(progress.current / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
              </div>
            </div>
          )}

          {state === "complete" && pdfPackage && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-green-800 dark:text-green-300">
                  ✓ Successfully generated{" "}
                  {pdfPackage.successCount}{" "}
                  form(s)!
                </p>
              </div>

              <div className="space-y-3">
                {pdfPackage.forms.map((form) => (
                  <div
                    key={form.formType}
                    className={`p-4 border rounded-md ${
                      form.success
                        ? "bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700"
                        : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Form {form.formType}:{" "}
                          {getFormName(
                            form.formType,
                          )}
                        </h3>
                        {!form.success &&
                          form.error && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                              Error: {form.error}
                            </p>
                          )}
                      </div>

                      {form.success && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadSingle(
                              form.formType,
                            )
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Download
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {pdfPackage.successCount > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAll}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                >
                  Download All Forms
                </button>
              )}
            </div>
          )}

          {state === "error" && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-300">
                  <strong>Error:</strong> {error}
                </p>
              </div>

              {pdfPackage &&
                pdfPackage.forms.length > 0 && (
                  <div className="space-y-3">
                    {pdfPackage.forms.map(
                      (form) => (
                        <div
                          key={form.formType}
                          className={`p-4 border rounded-md ${
                            form.success
                              ? "bg-white dark:bg-gray-750 border-gray-200 dark:border-gray-700"
                              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                Form{" "}
                                {form.formType}:{" "}
                                {getFormName(
                                  form.formType,
                                )}
                              </h3>
                              {form.success ? (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                  ✓ Generated
                                  successfully
                                </p>
                              ) : (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                  ✗{" "}
                                  {form.error ||
                                    "Generation failed"}
                                </p>
                              )}
                            </div>

                            {form.success && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleDownloadSingle(
                                    form.formType,
                                  )
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          {state === "ready" && (
            <>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
              >
                Generate Forms
              </button>
            </>
          )}

          {(state === "complete" ||
            state === "error") && (
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
