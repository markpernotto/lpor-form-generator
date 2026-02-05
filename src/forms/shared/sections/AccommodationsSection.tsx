import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleRadioGroup } from "../../../components/AccessibleRadioGroup";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Accommodations Section
 * Fields 50-53 from schema: Court interpreter and accessibility needs
 */

interface AccommodationsSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const AccommodationsSection: React.FC<
  AccommodationsSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  const showInterpreterLanguage =
    useConditionalDisplay(
      "show_if:need_interpreter=true",
    );

  const showWitnessLanguage =
    useConditionalDisplay(
      "show_if:witness_interpreter=true",
    );

  const isComplete =
    formData.need_interpreter !== undefined &&
    formData.witness_interpreter !== undefined;

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
            {t(
              "intake.accommodations.sectionTitle",
            )}
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
                "intake.accommodations.rights_notice",
              )}
            </p>
          </div>

          <AccessibleRadioGroup
            name="need-interpreter"
            label={t(
              "intake.accommodations.need_interpreter.label",
            )}
            value={
              formData.need_interpreter === true
                ? "yes"
                : formData.need_interpreter ===
                    false
                  ? "no"
                  : ""
            }
            onChange={(value) => {
              const boolValue = value === "yes";
              updateField(
                "need_interpreter",
                boolValue,
              );
              if (!boolValue) {
                updateField(
                  "interpreter_language",
                  undefined,
                );
              }
            }}
            options={[
              {
                value: "yes",
                label: t(
                  "intake.accommodations.need_interpreter.options.yes",
                ),
              },
              {
                value: "no",
                label: t(
                  "intake.accommodations.need_interpreter.options.no",
                ),
              },
            ]}
            required
            helpText={t(
              "intake.accommodations.need_interpreter.helpText",
            )}
          />

          {showInterpreterLanguage && (
            <AccessibleTextInput
              id="interpreter-language"
              label={t(
                "intake.accommodations.interpreter_language.label",
              )}
              value={
                formData.interpreter_language ||
                ""
              }
              onChange={(value) =>
                updateField(
                  "interpreter_language",
                  value,
                )
              }
              placeholder={t(
                "intake.accommodations.interpreter_language.placeholder",
              )}
              required
              helpText={t(
                "intake.accommodations.interpreter_language.helpText",
              )}
            />
          )}

          <AccessibleRadioGroup
            name="witness-interpreter"
            label={t(
              "intake.accommodations.witness_interpreter.label",
            )}
            value={
              formData.witness_interpreter ===
              true
                ? "yes"
                : formData.witness_interpreter ===
                    false
                  ? "no"
                  : ""
            }
            onChange={(value) => {
              const boolValue = value === "yes";
              updateField(
                "witness_interpreter",
                boolValue,
              );
              if (!boolValue) {
                updateField(
                  "witness_language",
                  undefined,
                );
              }
            }}
            options={[
              {
                value: "yes",
                label: t(
                  "intake.accommodations.witness_interpreter.options.yes",
                ),
              },
              {
                value: "no",
                label: t(
                  "intake.accommodations.witness_interpreter.options.no",
                ),
              },
            ]}
            required
            helpText={t(
              "intake.accommodations.witness_interpreter.helpText",
            )}
          />

          {showWitnessLanguage && (
            <AccessibleTextInput
              id="witness-language"
              label={t(
                "intake.accommodations.witness_language.label",
              )}
              value={
                formData.witness_language || ""
              }
              onChange={(value) =>
                updateField(
                  "witness_language",
                  value,
                )
              }
              placeholder={t(
                "intake.accommodations.witness_language.placeholder",
              )}
              required
              helpText={t(
                "intake.accommodations.witness_language.helpText",
              )}
            />
          )}

          <AccessibleCheckbox
            id="disability-accommodations"
            label={t(
              "intake.accommodations.disability_accommodations.label",
            )}
            checked={
              formData.disability_accommodations ||
              false
            }
            onChange={(checked) =>
              updateField(
                "disability_accommodations",
                checked,
              )
            }
            helpText={t(
              "intake.accommodations.disability_accommodations.helpText",
            )}
          />

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              {t(
                "intake.accommodations.clerk_notice",
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
