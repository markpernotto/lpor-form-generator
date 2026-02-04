import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { LOUISIANA_PARISHES } from "../../../constants/formOptions";

/**
 * Defendant (Abuser) Information Section
 * Fields 60-69 from schema: abuser details and address
 */

interface DefendantSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const DefendantSection: React.FC<
  DefendantSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const showParentGuardian =
    useConditionalDisplay(
      "show_if:abuser_is_minor=true",
    );
  const showAddress = useConditionalDisplay(
    "show_if:know_abuser_address=true",
  );

  const isComplete = Boolean(
    formData.abuser_name &&
    formData.abuser_is_minor !== undefined &&
    formData.know_abuser_address !== undefined &&
    (!formData.know_abuser_address ||
      (formData.abuser_parish &&
        formData.abuser_address_street &&
        formData.abuser_address_city &&
        formData.abuser_address_state &&
        formData.abuser_address_zip)),
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
            Person You Need Protection From
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
            id="abuser-name"
            label="What is the full name of the person you need protection from?"
            value={formData.abuser_name || ""}
            onChange={(value) =>
              updateField("abuser_name", value)
            }
            placeholder="Enter their legal name if you know it"
            required
            enableVoiceInput
          />

          <AccessibleCheckbox
            id="abuser-is-minor"
            label="This person is under 18 years old"
            checked={
              formData.abuser_is_minor || false
            }
            onChange={(checked) =>
              updateField(
                "abuser_is_minor",
                checked,
              )
            }
            helpText="Check this only if the person you need protection from is a minor"
          />

          {showParentGuardian && (
            <AccessibleTextInput
              id="parent-guardian-name"
              label="What is the name of their parent or guardian?"
              value={
                formData.parent_guardian_name ||
                ""
              }
              onChange={(value) =>
                updateField(
                  "parent_guardian_name",
                  value,
                )
              }
              placeholder="Parent or guardian's name"
              required
              helpText="Required if abuser is under 18"
              enableVoiceInput
            />
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <AccessibleRadioGroup
              name="know-abuser-address"
              label="Do you know where this person lives or works?"
              value={
                formData.know_abuser_address ===
                true
                  ? "yes"
                  : formData.know_abuser_address ===
                      false
                    ? "no"
                    : ""
              }
              onChange={(value) =>
                updateField(
                  "know_abuser_address",
                  value === "yes",
                )
              }
              options={[
                {
                  value: "yes",
                  label:
                    "Yes, I know where they can be found",
                },
                {
                  value: "no",
                  label:
                    "No, I don't know their address",
                },
              ]}
              required
              helpText="We need an address to serve them with court papers. If you don't know, the court may help locate them."
            />
          </div>

          {showAddress && (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Provide an address where they
                  can be found. This can be their
                  home or work address.
                </p>
              </div>

              <AccessibleSelect
                id="abuser-parish"
                label="Which Louisiana parish does this person live in?"
                value={
                  formData.abuser_parish || ""
                }
                onChange={(value) =>
                  updateField(
                    "abuser_parish",
                    value,
                  )
                }
                options={LOUISIANA_PARISHES}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleTextInput
                  id="abuser-address-street"
                  label="Street Address"
                  value={
                    formData.abuser_address_street ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "abuser_address_street",
                      value,
                    )
                  }
                  placeholder="Number and street name"
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="abuser-address-apt"
                  label="Apartment/Unit Number"
                  value={
                    formData.abuser_address_apt ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "abuser_address_apt",
                      value,
                    )
                  }
                  placeholder="Apt, Suite, Unit (optional)"
                  enableVoiceInput
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AccessibleTextInput
                  id="abuser-address-city"
                  label="City"
                  value={
                    formData.abuser_address_city ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "abuser_address_city",
                      value,
                    )
                  }
                  placeholder="City"
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="abuser-address-state"
                  label="State"
                  value={
                    formData.abuser_address_state ||
                    "LA"
                  }
                  onChange={(value) =>
                    updateField(
                      "abuser_address_state",
                      value,
                    )
                  }
                  placeholder="State"
                  required
                />

                <AccessibleTextInput
                  id="abuser-address-zip"
                  label="ZIP Code"
                  value={
                    formData.abuser_address_zip ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "abuser_address_zip",
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
