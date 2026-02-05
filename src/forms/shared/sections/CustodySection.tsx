import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { CHILD_LOCATIONS } from "../../../constants/formOptions";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Custody Section
 * Fields 160-163 from schema: Temporary custody requests
 */

interface CustodySectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const CustodySection: React.FC<
  CustodySectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  const showCustodyOptions =
    useConditionalDisplay(
      "show_if:have_children=true",
    );

  const isComplete =
    !formData.have_children ||
    formData.request_temporary_custody !==
      undefined;

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
            {t("intake.custody.sectionTitle")}
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
          {!showCustodyOptions ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {t(
                  "intake.custody.not_applicable_notice",
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {t(
                    "intake.custody.temporary_custody_notice",
                  )}
                </p>
              </div>

              <AccessibleCheckbox
                id="request-temporary-custody"
                label={t(
                  "intake.custody.request_temporary_custody.label",
                )}
                checked={
                  formData.request_temporary_custody ||
                  false
                }
                onChange={(checked) =>
                  updateField(
                    "request_temporary_custody",
                    checked,
                  )
                }
                helpText={t(
                  "intake.custody.request_temporary_custody.helpText",
                )}
              />

              <AccessibleSelect
                id="children-current-location"
                label={t(
                  "intake.custody.children_current_location.label",
                )}
                value={
                  formData.children_current_location ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "children_current_location",
                    value,
                  )
                }
                options={CHILD_LOCATIONS}
                required
                helpText={t(
                  "intake.custody.children_current_location.helpText",
                )}
              />

              <AccessibleCheckbox
                id="police-retrieve-children"
                label={t(
                  "intake.custody.police_retrieve_children.label",
                )}
                checked={
                  formData.police_retrieve_children ||
                  false
                }
                onChange={(checked) =>
                  updateField(
                    "police_retrieve_children",
                    checked,
                  )
                }
                helpText={t(
                  "intake.custody.police_retrieve_children.helpText",
                )}
              />

              <AccessibleCheckbox
                id="supervised-visitation"
                label={t(
                  "intake.custody.supervised_visitation.label",
                )}
                checked={
                  formData.supervised_visitation ||
                  false
                }
                onChange={(checked) =>
                  updateField(
                    "supervised_visitation",
                    checked,
                  )
                }
                helpText={t(
                  "intake.custody.supervised_visitation.helpText",
                )}
              />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  {t(
                    "intake.custody.child_safety_notice",
                  )}
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-300">
                  {t(
                    "intake.custody.coordination_notice",
                  )}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
