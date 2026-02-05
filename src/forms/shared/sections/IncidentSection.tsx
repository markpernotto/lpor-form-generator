import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleTextarea } from "../../../components/AccessibleTextarea";
import { AccessibleDateInput } from "../../../components/AccessibleDateInput";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

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
  const { t } = useTranslation();

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
            {t("intake.incident.sectionTitle")}
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
              {t("intake.incident.safety_notice")}
            </p>
          </div>

          <AccessibleDateInput
            id="recent-incident-date"
            label={t(
              "intake.incident.recent_incident_date.label",
            )}
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
            helpText={t(
              "intake.incident.recent_incident_date.helpText",
            )}
          />

          <AccessibleTextarea
            id="recent-incident-description"
            label={t(
              "intake.incident.recent_incident_description.label",
            )}
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
            placeholder={t(
              "intake.incident.recent_incident_description.placeholder",
            )}
            rows={6}
            required
            helpText={t(
              "intake.incident.recent_incident_description.helpText",
            )}
          />

          {formData.recent_incident_description &&
            formData.recent_incident_description
              .length < 50 && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {t(
                  "intake.incident.character_count_error",
                  {
                    count:
                      formData
                        .recent_incident_description
                        .length,
                  },
                )}
              </p>
            )}

          <AccessibleTextarea
            id="past-incidents"
            label={t(
              "intake.incident.past_incidents.label",
            )}
            value={formData.past_incidents || ""}
            onChange={(value) =>
              updateField("past_incidents", value)
            }
            placeholder={t(
              "intake.incident.past_incidents.placeholder",
            )}
            rows={6}
            helpText={t(
              "intake.incident.past_incidents.helpText",
            )}
          />

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              {t(
                "intake.incident.remember_notice",
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
