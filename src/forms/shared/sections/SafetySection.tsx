import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";

/**
 * Safety & Address Section
 * Fields 20-25 from schema: address privacy and details
 */

interface SafetySectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const SafetySection: React.FC<
  SafetySectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  // Show address fields only if NOT keeping address private
  const showAddressFields = useConditionalDisplay(
    "show_if:keep_address_private=false",
  );

  const isComplete =
    formData.keep_address_private !== undefined &&
    (formData.keep_address_private === true ||
      (formData.current_address_street &&
        formData.current_address_city &&
        formData.current_address_state &&
        formData.current_address_zip));

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
            Safety & Address
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
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Privacy Protection:</strong>{" "}
              If you don't want the abuser to know
              your address, check the box below.
              Your address will be kept
              confidential in court records.
            </p>
          </div>

          <AccessibleCheckbox
            id="keep-address-private"
            label="Keep my address secret from the person I'm afraid of"
            checked={
              formData.keep_address_private ||
              false
            }
            onChange={(checked) =>
              updateField(
                "keep_address_private",
                checked,
              )
            }
            helpText="Select this if sharing your address could put you in danger"
          />

          {showAddressFields && (
            <>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Your Current Address
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This address will appear in
                  court documents.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleTextInput
                  id="current-address-street"
                  label="Street Address"
                  value={
                    formData.current_address_street ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_street",
                      value,
                    )
                  }
                  placeholder="Number and street name"
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="current-address-apt"
                  label="Apartment/Unit Number"
                  value={
                    formData.current_address_apt ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_apt",
                      value,
                    )
                  }
                  placeholder="Apt, Suite, Unit (optional)"
                  enableVoiceInput
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AccessibleTextInput
                  id="current-address-city"
                  label="City"
                  value={
                    formData.current_address_city ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_city",
                      value,
                    )
                  }
                  placeholder="City"
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="current-address-state"
                  label="State"
                  value={
                    formData.current_address_state ||
                    "LA"
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_state",
                      value,
                    )
                  }
                  placeholder="LA"
                  required
                />

                <AccessibleTextInput
                  id="current-address-zip"
                  label="ZIP Code"
                  value={
                    formData.current_address_zip ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_zip",
                      value,
                    )
                  }
                  placeholder="5-digit ZIP"
                  required
                />
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
