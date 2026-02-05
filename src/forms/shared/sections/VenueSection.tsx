import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { AccessibleSelect } from "../../../components/AccessibleSelect";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import {
  LOUISIANA_PARISHES,
  VENUE_REASONS,
} from "../../../constants/formOptions";
import { useTranslation } from "../../../i18n/hooks/useTranslation";

/**
 * Venue Section
 * Fields 70-71 from schema: Where to file and why
 */

interface VenueSectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const VenueSection: React.FC<
  VenueSectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  const handleVenueReasonsToggle = (
    reason: string,
    checked: boolean,
  ) => {
    const currentReasons =
      formData.venue_reasons || [];
    const newReasons = checked
      ? [...currentReasons, reason]
      : currentReasons.filter(
          (r) => r !== reason,
        );
    updateField("venue_reasons", newReasons);
  };

  const isComplete = Boolean(
    formData.filing_parish &&
    formData.venue_reasons &&
    formData.venue_reasons.length > 0,
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
            {t("intake.venue.sectionTitle")}
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
                "intake.venue.where_to_file_notice",
              )}
            </p>
          </div>

          <AccessibleSelect
            id="filing-parish"
            label={t(
              "intake.venue.filing_parish.label",
            )}
            value={formData.filing_parish || ""}
            onChange={(value) =>
              updateField("filing_parish", value)
            }
            options={LOUISIANA_PARISHES}
            required
            helpText={t(
              "intake.venue.filing_parish.helpText",
            )}
          />

          <fieldset>
            <legend className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t(
                "intake.venue.venue_reasons.label",
              )}{" "}
              *
            </legend>

            <div className="space-y-3">
              {VENUE_REASONS.map((reason) => (
                <AccessibleCheckbox
                  key={reason.value}
                  id={`venue-${reason.value}`}
                  label={reason.label}
                  checked={
                    formData.venue_reasons?.includes(
                      reason.value,
                    ) || false
                  }
                  onChange={(checked) =>
                    handleVenueReasonsToggle(
                      reason.value,
                      checked,
                    )
                  }
                  helpText={
                    reason.value === "i_live_here"
                      ? t(
                          "intake.venue.venue_reasons.helpText.i_live_here",
                        )
                      : reason.value ===
                          "abuser_lives_here"
                        ? t(
                            "intake.venue.venue_reasons.helpText.abuser_lives_here",
                          )
                        : reason.value ===
                            "abuse_happened_here"
                          ? t(
                              "intake.venue.venue_reasons.helpText.abuse_happened_here",
                            )
                          : reason.value ===
                              "children_live_here"
                            ? t(
                                "intake.venue.venue_reasons.helpText.children_live_here",
                              )
                            : undefined
                  }
                />
              ))}
            </div>
          </fieldset>

          {!formData.venue_reasons ||
          formData.venue_reasons.length === 0 ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              *{" "}
              {t(
                "intake.venue.venue_reasons.validation_error",
              )}
            </p>
          ) : null}

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              {t(
                "intake.venue.jurisdiction_notice",
              )}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
