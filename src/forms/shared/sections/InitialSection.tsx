import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useTranslation } from "../../../i18n/hooks/useTranslation";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";

/**
 * Initial Questions Section
 * Fields 1-3 from schema: filing_type, filing_for, who_needs_protection
 */

interface InitialSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const InitialSection: React.FC<
  InitialSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  // Determine if section is complete
  const isComplete = Boolean(
    formData.filing_type &&
    formData.filing_for &&
    formData.who_needs_protection &&
    formData.who_needs_protection.length > 0,
  );

  const handleWhoNeedsProtectionChange = (
    value: string,
    checked: boolean,
  ) => {
    const current =
      formData.who_needs_protection || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    updateField("who_needs_protection", updated);
  };

  // Translated options
  const filingTypeOptions = [
    {
      value: "initial",
      label: t(
        "intake.initial.filing_type.options.initial",
      ),
    },
    {
      value: "supplemental",
      label: t(
        "intake.initial.filing_type.options.supplemental",
      ),
    },
  ];

  const filingForOptions = [
    {
      value: "self",
      label: t(
        "intake.initial.filing_for.options.self",
      ),
    },
    {
      value: "behalf",
      label: t(
        "intake.initial.filing_for.options.behalf",
      ),
    },
  ];

  const whoNeedsProtectionOptions = [
    {
      value: "self",
      label: t(
        "intake.initial.who_needs_protection.options.self",
      ),
    },
    {
      value: "children",
      label: t(
        "intake.initial.who_needs_protection.options.children",
      ),
    },
    {
      value: "incompetent",
      label: t(
        "intake.initial.who_needs_protection.options.incompetent",
      ),
    },
  ];

  return (
    <section className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Section Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("intake.initial.sectionTitle")}
          </span>
          {isComplete && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ {t("common.complete")}
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

      {/* Section Content */}
      {isExpanded && (
        <div className="px-6 py-6 space-y-6 bg-white dark:bg-gray-800/50">
          {/* Field 1: Filing Type */}
          <AccessibleRadioGroup
            name="filing_type"
            label={t(
              "intake.initial.filing_type.label",
            )}
            value={formData.filing_type || ""}
            onChange={(value) =>
              updateField("filing_type", value)
            }
            options={filingTypeOptions}
            required
            helpText={t(
              "intake.initial.filing_type.helpText",
            )}
          />

          {/* Field 2: Filing For */}
          <AccessibleRadioGroup
            name="filing_for"
            label={t(
              "intake.initial.filing_for.label",
            )}
            value={formData.filing_for || ""}
            onChange={(value) =>
              updateField("filing_for", value)
            }
            options={filingForOptions}
            required
            helpText={t(
              "intake.initial.filing_for.helpText",
            )}
          />

          {/* Field 3: Who Needs Protection (Checkboxes) */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {t(
                "intake.initial.who_needs_protection.label",
              )}
              <span className="text-red-500 ml-1">
                *
              </span>
            </legend>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t(
                "intake.initial.who_needs_protection.helpText",
              )}
            </p>

            {whoNeedsProtectionOptions.map(
              (option) => (
                <AccessibleCheckbox
                  key={option.value}
                  id={`who-needs-protection-${option.value}`}
                  label={option.label}
                  checked={(
                    formData.who_needs_protection ||
                    []
                  ).includes(option.value)}
                  onChange={(checked) =>
                    handleWhoNeedsProtectionChange(
                      option.value,
                      checked,
                    )
                  }
                />
              ),
            )}

            {formData.who_needs_protection &&
              formData.who_needs_protection
                .length === 0 && (
                <p
                  className="text-sm text-red-600 dark:text-red-400"
                  role="alert"
                >
                  {t(
                    "intake.initial.who_needs_protection.validationError",
                  )}
                </p>
              )}
          </fieldset>
        </div>
      )}
    </section>
  );
};
