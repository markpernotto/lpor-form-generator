import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessiblePersonList } from "../../../components/AccessiblePersonList";
import type { PersonEntry } from "../../../components/AccessiblePersonList";

/**
 * Witness Section
 * Fields 190-194 from schema: Witness information
 */

interface WitnessSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const WitnessSection: React.FC<
  WitnessSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const {
    formData,
    updateField,
    updateMultipleFields,
  } = useFormState();

  const handleWitnessesChange = (
    witnesses: PersonEntry[],
  ) => {
    updateMultipleFields({
      witnesses,
      number_of_witnesses: witnesses.length,
    });
  };

  const isComplete =
    formData.have_witnesses !== undefined;

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
            Witnesses
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
                Witnesses Strengthen Your Case:
              </strong>{" "}
              People who saw or heard the abuse,
              or who you told about it afterwards,
              can testify at your hearing. You
              don't need witnesses to get a
              protection order, but they can help.
            </p>
          </div>

          <AccessibleCheckbox
            id="have-witnesses"
            label="Do you have witnesses who can testify about the abuse?"
            checked={
              formData.have_witnesses || false
            }
            onChange={(checked) => {
              updateField(
                "have_witnesses",
                checked,
              );
              if (!checked) {
                updateMultipleFields({
                  witnesses: [],
                  number_of_witnesses: 0,
                });
              }
            }}
            helpText="Check this if you have people who can testify about the abuse (not required)"
          />

          {formData.have_witnesses && (
            <>
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>
                    Who can be a witness?
                  </strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-2">
                  <li>
                    People who saw or heard the
                    abuse happen
                  </li>
                  <li>
                    Neighbors who heard arguments
                    or screaming
                  </li>
                  <li>
                    Friends or family you told
                    about the abuse
                  </li>
                  <li>
                    Medical professionals who
                    treated injuries
                  </li>
                  <li>
                    Police officers who responded
                    to incidents
                  </li>
                  <li>
                    Anyone who saw injuries or
                    property damage
                  </li>
                </ul>
              </div>

              <AccessiblePersonList
                id="witnesses"
                label="List potential witnesses"
                entries={formData.witnesses || []}
                onEntriesChange={
                  handleWitnessesChange
                }
                addButtonText="Add witness"
                emptyStateText="No witnesses added yet"
                nameLabel="Witness name"
                dobLabel="Date of Birth"
                relationshipLabel="How do they know about the abuse?"
                namePlaceholder="Full name"
                relationshipPlaceholder="e.g., Neighbor who heard incident, Friend I told about abuse"
              />

              {formData.witnesses &&
                formData.witnesses.length > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <strong>Good:</strong>{" "}
                      You've listed{" "}
                      {formData.witnesses.length}{" "}
                      potential witness
                      {formData.witnesses
                        .length !== 1
                        ? "es"
                        : ""}
                      . The court will tell you
                      how to notify them about the
                      hearing date.
                    </p>
                  </div>
                )}

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Important:</strong> You
                  are responsible for making sure
                  your witnesses come to court.
                  The court will provide
                  instructions on how to subpoena
                  witnesses if needed.
                </p>
              </div>
            </>
          )}

          {!formData.have_witnesses &&
            formData.have_witnesses !==
              undefined && (
              <div className="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>No witnesses?</strong>{" "}
                  You can still get a protection
                  order. Your own testimony under
                  oath is evidence. Many
                  protection orders are granted
                  based on the victim's testimony
                  alone.
                </p>
              </div>
            )}
        </div>
      )}
    </section>
  );
};
