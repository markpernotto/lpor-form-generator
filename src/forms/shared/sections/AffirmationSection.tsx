import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";

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
            Affirmation & Signature
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
              <strong>⚠️ Legal Warning:</strong>{" "}
              Making false statements on this form
              is perjury, a crime punishable by
              law. Only provide information you
              know to be true.
            </p>
          </div>

          <AccessibleCheckbox
            id="statement-true"
            label="I swear that everything in this petition is true to the best of my knowledge"
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
            helpText="By checking this box, you are swearing under oath"
          />

          <AccessibleCheckbox
            id="understand-perjury"
            label="I understand that lying on this form is perjury, a crime"
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
            helpText="Criminal penalties apply to false statements"
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
              Your electronic submission of this
              form constitutes your legal
              signature. The generated PDFs will
              include the date you submitted this
              form.
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Next Step:</strong> After
              you submit this form, you will
              receive PDF documents to file with
              the court. Take these documents to
              the clerk's office at your parish
              courthouse.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
