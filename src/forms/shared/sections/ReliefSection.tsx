import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextarea } from "../../../components/AccessibleTextarea";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Relief Requested Section
 * Fields 140-149 from schema: What protection the petitioner is requesting
 */

interface ReliefSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ReliefSection: React.FC<
  ReliefSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  const handleReliefToggle = (
    relief: string,
    checked: boolean,
  ) => {
    const currentRelief =
      formData.relief_requested || [];
    const newRelief = checked
      ? [...currentRelief, relief]
      : currentRelief.filter((r) => r !== relief);
    updateField("relief_requested", newRelief);
  };

  const isComplete = Boolean(
    formData.relief_requested &&
    formData.relief_requested.length > 0,
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
            {t("intake.relief.sectionTitle")}
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
                "intake.relief.what_to_order_notice",
              )}
            </p>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t("intake.relief.relief_legend")} *
            </legend>

            <div className="space-y-3">
              <AccessibleCheckbox
                id="relief-no-abuse"
                label={t(
                  "intake.relief.no_abuse.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "no_abuse",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "no_abuse",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.no_abuse.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-no-contact"
                label={t(
                  "intake.relief.no_contact.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "no_contact",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "no_contact",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.no_contact.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-stay-away-home"
                label={t(
                  "intake.relief.stay_away.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "stay_away_home",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "stay_away_home",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.stay_away.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-stay-away-work"
                label={t(
                  "intake.relief.stay_away_work.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "stay_away_work",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "stay_away_work",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.stay_away_work.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-stay-away-school"
                label={t(
                  "intake.relief.stay_away_school.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "stay_away_school",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "stay_away_school",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.stay_away_school.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-children-school"
                label={t(
                  "intake.relief.stay_away_children.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "stay_away_children_school",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "stay_away_children_school",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.stay_away_children.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-move-out"
                label={t(
                  "intake.relief.move_out.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "move_out",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "move_out",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.move_out.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-exclusive-use"
                label={t(
                  "intake.relief.exclusive_use_home.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "exclusive_use_home",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "exclusive_use_home",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.exclusive_use_home.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-surrender-guns"
                label={t(
                  "intake.relief.surrender_firearms.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "surrender_firearms",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "surrender_firearms",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.surrender_firearms.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-temporary-custody"
                label={t(
                  "intake.relief.temporary_custody.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "temporary_custody",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "temporary_custody",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.temporary_custody.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-child-support"
                label={t(
                  "intake.relief.child_support.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "child_support",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "child_support",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.child_support.helpText",
                )}
              />

              <AccessibleCheckbox
                id="relief-spousal-support"
                label={t(
                  "intake.relief.spousal_support.label",
                )}
                checked={
                  formData.relief_requested?.includes(
                    "spousal_support",
                  ) || false
                }
                onChange={(checked) =>
                  handleReliefToggle(
                    "spousal_support",
                    checked,
                  )
                }
                helpText={t(
                  "intake.relief.spousal_support.helpText",
                )}
              />
            </div>
          </fieldset>

          {!isComplete && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {t(
                "intake.relief.validation_message",
              )}
            </p>
          )}

          <AccessibleTextarea
            id="relief-other"
            label={t(
              "intake.relief.other_relief_label",
            )}
            value={formData.relief_other || ""}
            onChange={(value) =>
              updateField("relief_other", value)
            }
            placeholder={t(
              "intake.relief.other_relief_placeholder",
            )}
            rows={4}
            helpText={t(
              "intake.relief.other_relief_helpText",
            )}
          />

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              {t("intake.relief.remember_notice")}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
