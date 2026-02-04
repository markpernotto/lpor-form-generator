import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextarea } from "../../../components/AccessibleTextarea";

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
            Protection Requested
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
                What do you want the court to
                order?
              </strong>{" "}
              Check all protections you need.
              These will be included in your
              protection order if granted.
            </p>
          </div>

          <fieldset>
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              I am asking the court to order:
              (Check all that apply) *
            </legend>

            <div className="space-y-3">
              <AccessibleCheckbox
                id="relief-no-abuse"
                label="Stop abusing, harassing, stalking, or threatening me"
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
                helpText="Basic protection order - stop all abuse"
              />

              <AccessibleCheckbox
                id="relief-no-contact"
                label="Have no contact with me (in person, phone, text, email, social media)"
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
                helpText="Complete contact ban"
              />

              <AccessibleCheckbox
                id="relief-stay-away-home"
                label="Stay away from my home"
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
                helpText="Cannot come to your residence"
              />

              <AccessibleCheckbox
                id="relief-stay-away-work"
                label="Stay away from my workplace"
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
                helpText="Cannot come to where you work"
              />

              <AccessibleCheckbox
                id="relief-stay-away-school"
                label="Stay away from my school"
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
                helpText="Cannot come to your educational institution"
              />

              <AccessibleCheckbox
                id="relief-children-school"
                label="Stay away from my children's school or daycare"
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
                helpText="Cannot approach where your children are educated"
              />

              <AccessibleCheckbox
                id="relief-move-out"
                label="Move out of our shared home"
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
                helpText="Order them to leave if you live together"
              />

              <AccessibleCheckbox
                id="relief-exclusive-use"
                label="Give me exclusive use and possession of our home"
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
                helpText="You get to stay, they cannot return"
              />

              <AccessibleCheckbox
                id="relief-surrender-guns"
                label="Surrender all firearms and weapons"
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
                helpText="Order them to turn in all guns to law enforcement"
              />

              <AccessibleCheckbox
                id="relief-temporary-custody"
                label="Temporary custody of children"
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
                helpText="You get temporary custody until hearing"
              />

              <AccessibleCheckbox
                id="relief-child-support"
                label="Child support"
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
                helpText="Financial support for children"
              />

              <AccessibleCheckbox
                id="relief-spousal-support"
                label="Spousal support"
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
                helpText="Financial support for you"
              />
            </div>
          </fieldset>

          {!isComplete && (
            <p className="text-sm text-red-600 dark:text-red-400">
              * Please select at least one type of
              protection
            </p>
          )}

          <AccessibleTextarea
            id="relief-other"
            label="Other protections you need (optional)"
            value={formData.relief_other || ""}
            onChange={(value) =>
              updateField("relief_other", value)
            }
            placeholder="Describe any other protections you need that aren't listed above..."
            rows={4}
            helpText="Be specific about what you need to be safe"
          />

          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-300">
              <strong>Remember:</strong> The judge
              will decide which protections to
              grant based on your situation. Don't
              hesitate to ask for everything you
              need to be safe.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
