import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Firearms Section
 * Fields 120-126 from schema: gun ownership and details
 */

interface FirearmsSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const FirearmsSection: React.FC<
  FirearmsSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const {
    formData,
    updateField,
    updateMultipleFields,
  } = useFormState();
  const { t } = useTranslation();

  const showGunDetails = useConditionalDisplay(
    "show_if:abuser_has_guns=true",
  );

  const isComplete =
    formData.abuser_has_guns !== undefined;

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
            {t("intake.firearms.sectionTitle")}
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
                "intake.firearms.safety_warning",
              )}
            </p>
          </div>

          <AccessibleCheckbox
            id="abuser-has-guns"
            label={t(
              "intake.firearms.abuser_has_guns.label",
            )}
            checked={
              formData.abuser_has_guns || false
            }
            onChange={(checked) => {
              updateField(
                "abuser_has_guns",
                checked,
              );
              if (!checked) {
                // Clear gun-related fields if user says no
                updateMultipleFields({
                  gun_threats: false,
                  concealed_carry: false,
                  number_of_guns: undefined,
                  firearms: [],
                });
              }
            }}
            helpText={t(
              "intake.firearms.abuser_has_guns.helpText",
            )}
          />

          {showGunDetails && (
            <>
              <AccessibleRadioGroup
                name="gun-threats"
                label={t(
                  "intake.firearms.gun_threats.label",
                )}
                value={
                  formData.gun_threats === true
                    ? "yes"
                    : formData.gun_threats ===
                        false
                      ? "no"
                      : ""
                }
                onChange={(value) => {
                  const boolValue =
                    value === "yes";
                  updateField(
                    "gun_threats",
                    boolValue,
                  );
                }}
                options={[
                  {
                    value: "yes",
                    label: t(
                      "intake.firearms.gun_threats.options.yes",
                    ),
                  },
                  {
                    value: "no",
                    label: t(
                      "intake.firearms.gun_threats.options.no",
                    ),
                  },
                ]}
                required
                helpText={t(
                  "intake.firearms.gun_threats.helpText",
                )}
              />

              <AccessibleCheckbox
                id="concealed-carry"
                label={t(
                  "intake.firearms.concealed_carry.label",
                )}
                checked={
                  formData.concealed_carry ||
                  false
                }
                onChange={(checked) =>
                  updateField(
                    "concealed_carry",
                    checked,
                  )
                }
                helpText={t(
                  "intake.firearms.concealed_carry.helpText",
                )}
              />

              <AccessibleTextInput
                id="number-of-guns"
                label={t(
                  "intake.firearms.number_of_guns.label",
                )}
                value={
                  formData.number_of_guns?.toString() ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "number_of_guns",
                    value
                      ? parseInt(value)
                      : undefined,
                  )
                }
                placeholder={t(
                  "intake.firearms.number_of_guns.placeholder",
                )}
                helpText={t(
                  "intake.firearms.number_of_guns.helpText",
                )}
              />

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  Detailed firearm information
                  will generate an additional form
                  (LPOR-G) for the court.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
