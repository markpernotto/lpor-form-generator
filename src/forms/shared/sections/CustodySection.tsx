import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { CHILD_LOCATIONS } from "../../../constants/formOptions";

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
            Temporary Custody
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
                This section only applies if you
                have children. You indicated
                earlier that you don't have
                children, so you can skip this
                section.
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>
                    Temporary Custody:
                  </strong>{" "}
                  The court can grant you
                  temporary custody of your
                  children until a full hearing.
                  This is separate from permanent
                  custody arrangements.
                </p>
              </div>

              <AccessibleCheckbox
                id="request-temporary-custody"
                label="Do you want temporary custody of your children?"
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
                helpText="Check this if you want temporary custody until the hearing"
              />

              <AccessibleSelect
                id="children-current-location"
                label="Where are your children right now?"
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
                helpText="Current physical location of the children"
              />

              <AccessibleCheckbox
                id="police-retrieve-children"
                label="Do you need police assistance to safely retrieve your children?"
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
                helpText="Court can order police escort for child retrieval"
              />

              <AccessibleCheckbox
                id="supervised-visitation"
                label="Should the abuser's visitation be supervised?"
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
                helpText="Require supervision if they get visitation rights"
              />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Child Safety:</strong>{" "}
                  If your children witnessed abuse
                  or were directly harmed,
                  temporary custody helps protect
                  them immediately. The court will
                  schedule a full hearing within
                  30 days.
                </p>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                <p className="text-sm text-green-800 dark:text-green-300">
                  <strong>Note:</strong> Temporary
                  custody in a protection order
                  does not replace or override
                  existing custody orders. The
                  court will coordinate with any
                  ongoing custody proceedings.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
