import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Affirmation Section
 * Fields 220-223 from schema: Final oath and signature
 */

interface AffirmationSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const AffirmationSection: React.FC<
  AffirmationSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  // Auto-populate today's date
  React.useEffect(() => {
    if (!formData.signature_date) {
      const today = new Date()
        .toISOString()
        .split("T")[0];
      updateField("signature_date", today);
    }
  }, [formData.signature_date, updateField]);

  const isComplete = Boolean(
    formData.statement_true &&
    formData.understand_perjury,
  );

  return (
    <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("intake.affirmation.sectionTitle")}
          </span>
          {isComplete && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ Complete
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-6 py-6 space-y-6 bg-white dark:bg-gray-800/50">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-300">
              {t(
                "intake.affirmation.legal_warning",
              )}
            </p>
          </div>

          <AccessibleCheckbox
            id="statement-true"
            label={t(
              "intake.affirmation.statement_true.label",
            )}
            checked={
              formData.statement_true || false
            }
            onChange={(checked) =>
              updateField(
                "statement_true",
                checked,
              )
            }
            required
            helpText={t(
              "intake.affirmation.statement_true.helpText",
            )}
          />

          <AccessibleCheckbox
            id="understand-perjury"
            label={t(
              "intake.affirmation.understand_perjury.label",
            )}
            checked={
              formData.understand_perjury || false
            }
            onChange={(checked) =>
              updateField(
                "understand_perjury",
                checked,
              )
            }
            required
            helpText={t(
              "intake.affirmation.understand_perjury.helpText",
            )}
          />

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Date:</strong>{" "}
              {formData.signature_date
                ? new Date(
                    formData.signature_date,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Today"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t(
                "intake.affirmation.signature_notice",
              )}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              {t(
                "intake.affirmation.next_step_notice",
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
