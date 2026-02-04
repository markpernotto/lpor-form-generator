import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";

/**
 * Abuse Types Section
 * Fields 100-102 from schema: Types of abuse experienced
 */

interface AbuseSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const AbuseSection: React.FC<
  AbuseSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const handleAbuseTypeToggle = (
    type: string,
    checked: boolean,
  ) => {
    const currentTypes =
      formData.abuse_types || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter((t) => t !== type);
    updateField("abuse_types", newTypes);
  };

  const isComplete = Boolean(
    formData.abuse_types &&
    formData.abuse_types.length > 0,
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
            Types of Abuse
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
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
            <p className="text-sm text-purple-800 dark:text-purple-300">
              <strong>You are not alone.</strong>{" "}
              Check all types of abuse you have
              experienced. This helps the court
              understand your situation fully.
            </p>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              What types of abuse have you
              experienced? (Check all that apply)
              *
            </legend>

            <div className="space-y-3">
              <AccessibleCheckbox
                id="abuse-physical"
                label="Physical abuse (hitting, pushing, slapping, restraining)"
                checked={
                  formData.abuse_types?.includes(
                    "physical",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "physical",
                    checked,
                  )
                }
                helpText="Any unwanted physical contact or violence"
              />

              <AccessibleCheckbox
                id="abuse-threats"
                label="Threats of violence (threatened to hurt you or others)"
                checked={
                  formData.abuse_types?.includes(
                    "threats",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "threats",
                    checked,
                  )
                }
                helpText="Including threats to hurt children, pets, or family"
              />

              <AccessibleCheckbox
                id="abuse-sexual"
                label="Sexual abuse or assault"
                checked={
                  formData.abuse_types?.includes(
                    "sexual",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "sexual",
                    checked,
                  )
                }
                helpText="Any unwanted sexual contact or coercion"
              />

              <AccessibleCheckbox
                id="abuse-emotional"
                label="Emotional/psychological abuse (name-calling, humiliation, control)"
                checked={
                  formData.abuse_types?.includes(
                    "emotional",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "emotional",
                    checked,
                  )
                }
                helpText="Constant criticism, isolation, intimidation"
              />

              <AccessibleCheckbox
                id="abuse-stalking"
                label="Stalking or harassment"
                checked={
                  formData.abuse_types?.includes(
                    "stalking",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "stalking",
                    checked,
                  )
                }
                helpText="Following you, unwanted contact, surveillance"
              />

              <AccessibleCheckbox
                id="abuse-property"
                label="Destruction of property (breaking your belongings)"
                checked={
                  formData.abuse_types?.includes(
                    "property_damage",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "property_damage",
                    checked,
                  )
                }
                helpText="Damaging your phone, car, clothes, or other items"
              />

              <AccessibleCheckbox
                id="abuse-financial"
                label="Economic/financial abuse (controlling money, preventing work)"
                checked={
                  formData.abuse_types?.includes(
                    "economic",
                  ) || false
                }
                onChange={(checked) =>
                  handleAbuseTypeToggle(
                    "economic",
                    checked,
                  )
                }
                helpText="Taking your money, preventing employment"
              />
            </div>
          </fieldset>

          {!isComplete && (
            <p className="text-sm text-red-600 dark:text-red-400">
              * Please select at least one type of
              abuse
            </p>
          )}

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <AccessibleCheckbox
              id="choking-strangulation"
              label="Has the person ever choked or strangled you?"
              checked={
                formData.choking_strangulation ||
                false
              }
              onChange={(checked) =>
                updateField(
                  "choking_strangulation",
                  checked,
                )
              }
              helpText="Strangulation is a critical risk factor"
            />

            <AccessibleCheckbox
              id="abuse-while-pregnant"
              label="Were you pregnant when any abuse occurred?"
              checked={
                formData.abuse_while_pregnant ||
                false
              }
              onChange={(checked) =>
                updateField(
                  "abuse_while_pregnant",
                  checked,
                )
              }
              helpText="Optional but important safety information"
            />
          </div>
        </div>
      )}
    </section>
  );
};
