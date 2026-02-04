import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { HOME_OWNERSHIP } from "../../../constants/formOptions";

/**
 * Property Section
 * Fields 150-155 from schema: Property protection and pet safety
 */

interface PropertySectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const PropertySection: React.FC<
  PropertySectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const showExclusiveUse = useConditionalDisplay(
    "show_if:shared_residence=true",
  );

  const isComplete =
    formData.shared_residence !== undefined;

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
            Property & Pets
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
              <strong>
                Property Protection:
              </strong>{" "}
              The court can order exclusive use of
              your home and protect your personal
              property and pets.
            </p>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Shared Residence
            </legend>

            <AccessibleCheckbox
              id="shared-residence"
              label="Do you and the abuser share a residence?"
              checked={
                formData.shared_residence || false
              }
              onChange={(checked) => {
                updateField(
                  "shared_residence",
                  checked,
                );
                if (!checked) {
                  updateField(
                    "request_exclusive_use",
                    false,
                  );
                  updateField(
                    "home_ownership",
                    undefined,
                  );
                }
              }}
              helpText="Check this if you currently live together or recently lived together"
            />

            {showExclusiveUse && (
              <>
                <AccessibleCheckbox
                  id="request-exclusive-use"
                  label="Do you want exclusive use of the home?"
                  checked={
                    formData.request_exclusive_use ||
                    false
                  }
                  onChange={(checked) =>
                    updateField(
                      "request_exclusive_use",
                      checked,
                    )
                  }
                  helpText="Order them to leave and give you sole possession"
                />

                <AccessibleSelect
                  id="home-ownership"
                  label="Who owns or leases the home?"
                  value={
                    formData.home_ownership || ""
                  }
                  onChange={(value) =>
                    updateField(
                      "home_ownership",
                      value,
                    )
                  }
                  options={HOME_OWNERSHIP}
                  required
                  helpText="Helps determine property rights"
                />
              </>
            )}
          </fieldset>

          <fieldset className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Personal Property Protection
            </legend>

            <AccessibleCheckbox
              id="protect-belongings"
              label="Do you need to protect specific personal belongings?"
              checked={
                formData.protect_belongings ||
                false
              }
              onChange={(checked) =>
                updateField(
                  "protect_belongings",
                  checked,
                )
              }
              helpText="Prevent them from damaging or taking your property"
            />

            <AccessibleCheckbox
              id="police-escort"
              label="Do you need police escort to retrieve your belongings?"
              checked={
                formData.police_escort || false
              }
              onChange={(checked) =>
                updateField(
                  "police_escort",
                  checked,
                )
              }
              helpText="Safe retrieval of items from shared residence"
            />
          </fieldset>

          <fieldset className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Pet Safety
            </legend>

            <AccessibleCheckbox
              id="have-pets"
              label="Do you have pets that need protection?"
              checked={
                formData.have_pets || false
              }
              onChange={(checked) => {
                updateField("have_pets", checked);
                if (!checked) {
                  updateField(
                    "pet_details",
                    undefined,
                  );
                }
              }}
              helpText="Pets are often used to threaten or harm victims"
            />

            {formData.have_pets && (
              <AccessibleTextInput
                id="pet-details"
                label="Describe your pets"
                value={formData.pet_details || ""}
                onChange={(value) =>
                  updateField(
                    "pet_details",
                    value,
                  )
                }
                placeholder="e.g., Black Lab named Max, 2 cats"
                helpText="Helps the court include pets in protection order"
              />
            )}
          </fieldset>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Important:</strong>{" "}
              Louisiana law recognizes that pets
              are family members who may need
              protection. The court can include
              pets in your protection order.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
