import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessiblePersonList } from "../../../components/AccessiblePersonList";
import type { PersonEntry } from "../../../components/AccessiblePersonList";

/**
 * Children Information Section
 * Fields 30-35 from schema: children details
 */

interface ChildrenSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const ChildrenSection: React.FC<
  ChildrenSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const {
    formData,
    updateField,
    updateMultipleFields,
  } = useFormState();

  const showChildrenList = useConditionalDisplay(
    "show_if:have_children=true",
  );
  const showSameAddress = useConditionalDisplay(
    "show_if:have_children=true",
  );

  const isComplete =
    formData.have_children !== undefined &&
    (!formData.have_children ||
      (formData.children &&
        formData.children.length > 0 &&
        formData.children_same_address !==
          undefined));

  const handleChildrenChange = (
    entries: PersonEntry[],
  ) => {
    updateMultipleFields({
      children: entries,
      number_of_children: entries.length,
    });
  };

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
            Children Information
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
          <AccessibleCheckbox
            id="have-children"
            label="Are there any children who need protection?"
            checked={
              formData.have_children || false
            }
            onChange={(checked) =>
              updateField(
                "have_children",
                checked,
              )
            }
            helpText="Include all minor children (under 18) who need to be protected"
          />

          {showChildrenList && (
            <>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <AccessiblePersonList
                  id="children-list"
                  label="Children Needing Protection"
                  description="Add details for each child below:"
                  entries={
                    formData.children || []
                  }
                  onEntriesChange={
                    handleChildrenChange
                  }
                  addButtonText="Add Child"
                  emptyStateText="No children added yet"
                  nameLabel="Child's Full Name"
                  dobLabel="Date of Birth"
                  relationshipLabel="Relationship to You"
                  namePlaceholder="Enter child's full legal name"
                  relationshipPlaceholder="e.g., Daughter, Son, Stepchild"
                  maxEntries={10}
                  required
                />
              </div>

              {showSameAddress && (
                <AccessibleCheckbox
                  id="children-same-address"
                  label="The children live with me at my address"
                  checked={
                    formData.children_same_address ||
                    false
                  }
                  onChange={(checked) =>
                    updateField(
                      "children_same_address",
                      checked,
                    )
                  }
                  required
                  helpText="Select yes if children share your address"
                />
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
};
