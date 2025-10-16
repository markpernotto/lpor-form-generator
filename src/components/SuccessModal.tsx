import React from "react";
import { useTranslation } from "../i18n/hooks/useTranslation";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  formType: "LPOR-F" | "LPOR-14";
}

export const SuccessModal: React.FC<
  SuccessModalProps
> = ({ isOpen, onClose, formType }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
          aria-describedby="success-description"
        >
          {/* Title */}
          <h3
            id="success-title"
            className="text-lg font-semibold text-gray-900 text-center mb-2"
          >
            {t("common.success.title")}
          </h3>

          {/* Description */}
          <div
            id="success-description"
            className="text-sm text-gray-600 space-y-3"
          >
            <p className="text-center">
              {t("common.success.description", {
                formType,
              })}
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-medium text-blue-900 mb-2">
                {t(
                  "common.success.nextSteps.title",
                )}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
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

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800">
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
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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
