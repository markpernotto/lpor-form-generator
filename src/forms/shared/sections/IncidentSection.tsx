import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleTextarea } from "../../../components/AccessibleTextarea";
import { AccessibleDateInput } from "../../../components/AccessibleDateInput";

/**
 * Incident Details Section
 * Fields 130-132 from schema: Recent and past incidents
 */

interface IncidentSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const IncidentSection: React.FC<
  IncidentSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();

  const isComplete = Boolean(
    formData.recent_incident_date &&
    formData.recent_incident_description &&
    formData.recent_incident_description.length >=
      50,
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
            Incident Details
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
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Your Safety:</strong> If you
              are in immediate danger right now,
              please call 911 or go to a safe
              location. This form can wait.
            </p>
          </div>

          <AccessibleDateInput
            id="recent-incident-date"
            label="When did the most recent incident happen?"
            value={
              formData.recent_incident_date || ""
            }
            onChange={(value) =>
              updateField(
                "recent_incident_date",
                value,
              )
            }
            required
            helpText="This helps establish urgency for your protection"
          />

          <AccessibleTextarea
            id="recent-incident-description"
            label="Please describe what happened in the most recent incident"
            value={
              formData.recent_incident_description ||
              ""
            }
            onChange={(value) =>
              updateField(
                "recent_incident_description",
                value,
              )
            }
            placeholder="Be specific about what they did or said. Include threats, physical violence, property damage..."
            rows={6}
            required
            helpText="Minimum 50 characters. Be as detailed as possible."
          />

          {formData.recent_incident_description &&
            formData.recent_incident_description
              .length < 50 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                Please provide more detail (
                {
                  formData
                    .recent_incident_description
                    .length
                }
                /50 characters minimum)
              </p>
            )}

          <AccessibleTextarea
            id="past-incidents"
            label="Please describe any past incidents of abuse (optional)"
            value={formData.past_incidents || ""}
            onChange={(value) =>
              updateField("past_incidents", value)
            }
            placeholder="Include dates if you remember them. List the most serious incidents..."
            rows={6}
            helpText="This helps show a pattern of behavior"
          />

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Remember:</strong> You don't
              need to prove everything right now.
              The court will hear your full story
              at the hearing. Focus on the most
              recent and serious incidents.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
