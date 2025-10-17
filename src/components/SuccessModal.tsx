import React from "react";
import { useTranslation } from "../i18n/hooks/useTranslation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: string; // e.g., "LPOR-F", future forms can use any string
  inline?: boolean; // Controls inline vs overlay display
}

export const SuccessModal: React.FC<
  SuccessModalProps
> = ({
  isOpen,
  onClose,
  formType,
  inline = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Inline version (for LPOR-F)
  if (inline) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Title */}
          <h3
            id="success-title"
            className="text-2xl font-semibold text-gray-900 dark:text-gray-100 text-center mb-4"
          >
            {t("common.success.title")}
          </h3>

          {/* Description */}
          <div
            id="success-description"
            className="text-sm text-gray-600 dark:text-gray-400 space-y-4"
          >
            <p className="text-center text-base">
              {t("common.success.description", {
                formType,
              })}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">
                {t(
                  "common.success.nextSteps.title",
                )}
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step1",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step2",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step3",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step4",
                  )}
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-medium">
                  {t("common.success.important")}
                </span>{" "}
                {t(
                  "common.success.importantNote",
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              autoFocus
            >
              {t("common.success.newForm")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Overlay version (for LPOR-14)
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          aria-describedby="success-description"
        >
          {/* Title */}
          <h3
            id="success-title"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2"
          >
            {t("common.success.title")}
          </h3>

          {/* Description */}
          <div
            id="success-description"
            className="text-sm text-gray-600 dark:text-gray-400 space-y-3"
          >
            <p className="text-center">
              {t("common.success.description", {
                formType,
              })}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                {t(
                  "common.success.nextSteps.title",
                )}
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step1",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step2",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step3",
                  )}
                </li>
                <li>
                  •{" "}
                  {t(
                    "common.success.nextSteps.step4",
                  )}
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <span className="font-medium">
                  {t("common.success.important")}
                </span>{" "}
                {t(
                  "common.success.importantNote",
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              autoFocus
            >
              {t("common.success.newForm")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
