import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { RELATIONSHIP_TYPES } from "../../../constants/formOptions";

/**
 * Relationship Section
 * Fields 80-81 from schema: Relationship to the abuser
 */

interface RelationshipSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const RelationshipSection: React.FC<
  RelationshipSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const isComplete = Boolean(
    formData.relationship_type,
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
            Your Relationship
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
              <strong>Why this matters:</strong>{" "}
              Louisiana law provides protection
              orders for specific relationships.
              Your relationship to the abuser
              determines which legal protections
              are available.
            </p>
          </div>

          <AccessibleSelect
            id="relationship-type"
            label="What is your relationship to the person you're afraid of?"
            value={
              formData.relationship_type || ""
            }
            onChange={(value) =>
              updateField(
                "relationship_type",
                value,
              )
            }
            options={RELATIONSHIP_TYPES}
            required
            helpText="Select the option that best describes your relationship"
          />

          <AccessibleCheckbox
            id="have-child-together"
            label="Do you have a child together?"
            checked={
              formData.have_child_together ||
              false
            }
            onChange={(checked) =>
              updateField(
                "have_child_together",
                checked,
              )
            }
            helpText="Even if you're not in a relationship now"
          />

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Current or Former:</strong>{" "}
              Protection orders cover both current
              relationships and former
              relationships. You don't have to be
              together now to qualify.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
