import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleDateInput } from "../../../components/AccessibleDateInput";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";

/**
 * Petitioner Information Section
 * Fields 10-12 from schema: full_name, birth_date, louisiana_resident
 */

interface PetitionerSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const PetitionerSection: React.FC<
  PetitionerSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const isComplete = Boolean(
    formData.petitioner_full_name &&
    formData.petitioner_birth_date &&
    formData.petitioner_louisiana_resident !==
      undefined,
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
            Your Information
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
          <AccessibleTextInput
            id="petitioner-full-name"
            label="What is your full legal name?"
            value={
              formData.petitioner_full_name || ""
            }
            onChange={(value) =>
              updateField(
                "petitioner_full_name",
                value,
              )
            }
            placeholder="Enter your full legal name"
            required
            helpText="Enter your name exactly as it appears on official documents"
            enableVoiceInput
          />

          <AccessibleDateInput
            id="petitioner-birth-date"
            label="What is your date of birth?"
            value={
              formData.petitioner_birth_date || ""
            }
            onChange={(value) =>
              updateField(
                "petitioner_birth_date",
                value,
              )
            }
            required
            helpText="Format: MM/DD/YYYY"
          />

          <AccessibleCheckbox
            id="petitioner-louisiana-resident"
            label="I am a resident of Louisiana"
            checked={
              formData.petitioner_louisiana_resident ||
              false
            }
            onChange={(checked) =>
              updateField(
                "petitioner_louisiana_resident",
                checked,
              )
            }
            helpText="You must be a Louisiana resident to use this form"
          />
        </div>
      )}
    </section>
  );
};
