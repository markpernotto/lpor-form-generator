import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { HOME_OWNERSHIP } from "../../../constants/formOptions";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

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
  const { t } = useTranslation();

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
            {t("intake.property.sectionTitle")}
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
              {t(
                "intake.property.property_notice",
              )}
            </p>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t(
                "intake.property.shared_residence_legend",
              )}
            </legend>

            <AccessibleCheckbox
              id="shared-residence"
              label={t(
                "intake.property.shared_residence.label",
              )}
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
              helpText={t(
                "intake.property.shared_residence.helpText",
              )}
            />

            {showExclusiveUse && (
              <>
                <AccessibleCheckbox
                  id="request-exclusive-use"
                  label={t(
                    "intake.property.request_exclusive_use.label",
                  )}
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
                  helpText={t(
                    "intake.property.request_exclusive_use.helpText",
                  )}
                />

                <AccessibleSelect
                  id="home-ownership"
                  label={t(
                    "intake.property.home_ownership.label",
                  )}
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
                  helpText={t(
                    "intake.property.home_ownership.helpText",
                  )}
                />
              </>
            )}
          </fieldset>

          <fieldset className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t(
                "intake.property.property_protection_legend",
              )}
            </legend>

            <AccessibleCheckbox
              id="protect-belongings"
              label={t(
                "intake.property.protect_belongings.label",
              )}
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
              helpText={t(
                "intake.property.protect_belongings.helpText",
              )}
            />

            <AccessibleCheckbox
              id="police-escort"
              label={t(
                "intake.property.police_escort.label",
              )}
              checked={
                formData.police_escort || false
              }
              onChange={(checked) =>
                updateField(
                  "police_escort",
                  checked,
                )
              }
              helpText={t(
                "intake.property.police_escort.helpText",
              )}
            />
          </fieldset>

          <fieldset className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("intake.property.pets_legend")}
            </legend>

            <AccessibleCheckbox
              id="have-pets"
              label={t(
                "intake.property.have_pets.label",
              )}
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
              helpText={t(
                "intake.property.have_pets.helpText",
              )}
            />

            {formData.have_pets && (
              <AccessibleTextInput
                id="pet-details"
                label={t(
                  "intake.property.pet_description.label",
                )}
                value={formData.pet_details || ""}
                onChange={(value) =>
                  updateField(
                    "pet_details",
                    value,
                  )
                }
                placeholder={t(
                  "intake.property.pet_description.placeholder",
                )}
                helpText={t(
                  "intake.property.pet_description.helpText",
                )}
              />
            )}
          </fieldset>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t(
                "intake.property.pet_safety_notice",
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
