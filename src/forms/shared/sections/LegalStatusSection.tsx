import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { LOUISIANA_PARISHES } from "../../../constants/formOptions";

/**
 * Legal Status Section
 * Fields 90-95 from schema: Divorce and custody case information
 */

interface LegalStatusSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const LegalStatusSection: React.FC<
  LegalStatusSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const showDivorceDetails =
    useConditionalDisplay(
      "show_if:pending_divorce=true",
    );
  const showCustodyDetails =
    useConditionalDisplay(
      "show_if:pending_custody=true",
    );

  const isComplete =
    formData.pending_divorce !== undefined &&
    formData.pending_custody !== undefined;

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
            Legal Status
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
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Existing Cases:</strong>{" "}
              Tell us about any divorce or custody
              cases involving you and the person
              you're afraid of. This helps the
              court coordinate your protection
              order with other legal proceedings.
            </p>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Divorce Proceedings
            </legend>

            <AccessibleCheckbox
              id="pending-divorce"
              label="Is there a pending divorce case between you and this person?"
              checked={
                formData.pending_divorce || false
              }
              onChange={(checked) => {
                updateField(
                  "pending_divorce",
                  checked,
                );
                if (!checked) {
                  updateField(
                    "divorce_petitioner",
                    undefined,
                  );
                  updateField(
                    "divorce_parish",
                    undefined,
                  );
                  updateField(
                    "divorce_case_number",
                    undefined,
                  );
                }
              }}
              helpText="Check this only if there is currently a divorce case pending"
            />

            {showDivorceDetails && (
              <>
                <AccessibleRadioGroup
                  name="divorce-petitioner"
                  label="Who filed for divorce?"
                  value={
                    formData.divorce_petitioner ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "divorce_petitioner",
                      value,
                    )
                  }
                  options={[
                    {
                      value: "i_filed",
                      label: "I filed",
                    },
                    {
                      value: "they_filed",
                      label: "They filed",
                    },
                    {
                      value: "joint",
                      label: "Joint filing",
                    },
                  ]}
                  required
                />

                <AccessibleSelect
                  id="divorce-parish"
                  label="Which parish is the divorce case in?"
                  value={
                    formData.divorce_parish || ""
                  }
                  onChange={(value) =>
                    updateField(
                      "divorce_parish",
                      value,
                    )
                  }
                  options={LOUISIANA_PARISHES}
                  required
                />

                <AccessibleTextInput
                  id="divorce-case-number"
                  label="Divorce case number (if known)"
                  value={
                    formData.divorce_case_number ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "divorce_case_number",
                      value,
                    )
                  }
                  placeholder="e.g., 2025-12345"
                  helpText="Optional but helpful for court coordination"
                />
              </>
            )}
          </fieldset>

          <fieldset className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Custody Proceedings
            </legend>

            <AccessibleCheckbox
              id="pending-custody"
              label="Is there a pending custody case?"
              checked={
                formData.pending_custody || false
              }
              onChange={(checked) => {
                updateField(
                  "pending_custody",
                  checked,
                );
                if (!checked) {
                  updateField(
                    "custody_parish",
                    undefined,
                  );
                  updateField(
                    "custody_case_number",
                    undefined,
                  );
                }
              }}
              helpText="Check this only if there is currently a custody case pending"
            />

            {showCustodyDetails && (
              <>
                <AccessibleSelect
                  id="custody-parish"
                  label="Which parish is the custody case in?"
                  value={
                    formData.custody_parish || ""
                  }
                  onChange={(value) =>
                    updateField(
                      "custody_parish",
                      value,
                    )
                  }
                  options={LOUISIANA_PARISHES}
                  required
                />

                <AccessibleTextInput
                  id="custody-case-number"
                  label="Custody case number (if known)"
                  value={
                    formData.custody_case_number ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "custody_case_number",
                      value,
                    )
                  }
                  placeholder="e.g., 2025-67890"
                  helpText="Optional but helpful for court coordination"
                />
              </>
            )}
          </fieldset>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Note:</strong> If case
              numbers are filed in different
              parishes, the court can still
              coordinate your protection order
              with those proceedings.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
