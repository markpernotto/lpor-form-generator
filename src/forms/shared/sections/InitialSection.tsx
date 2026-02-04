import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import {
  FILING_TYPES,
  FILING_FOR_OPTIONS,
  WHO_NEEDS_PROTECTION,
} from "../../../constants/formOptions";

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
            Initial Questions
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

      {/* Section Content */}
      {isExpanded && (
        <div className="px-6 py-6 space-y-6 bg-white dark:bg-gray-800/50">
          {/* Field 1: Filing Type */}
          <AccessibleRadioGroup
            name="filing_type"
            label="Is this your first time filing for protection or are you updating a previous request?"
            value={formData.filing_type || ""}
            onChange={(value) =>
              updateField("filing_type", value)
            }
            options={FILING_TYPES}
            required
            helpText="Choose 'First time' if this is new, 'Update' if modifying existing petition"
          />

          {/* Field 2: Filing For */}
          <AccessibleRadioGroup
            name="filing_for"
            label="Are you filling this out for yourself or someone else?"
            value={formData.filing_for || ""}
            onChange={(value) =>
              updateField("filing_for", value)
            }
            options={FILING_FOR_OPTIONS}
            required
            helpText="Choose 'For myself' if you need protection, 'For someone else' if helping another person"
          />

          {/* Field 3: Who Needs Protection (Checkboxes) */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Who needs protection? (Check all
              that apply)
              <span className="text-red-500 ml-1">
                *
              </span>
            </legend>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Select everyone who needs to be
              protected from harm
            </p>

            {WHO_NEEDS_PROTECTION.map(
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
                  Please select at least one
                  option
                </p>
              )}
          </fieldset>
        </div>
      )}
    </section>
  );
};
