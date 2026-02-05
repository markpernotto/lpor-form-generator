import React from "react";
import { useFormState } from "../../../contexts/FormStateContext";
import { useTranslation } from "../../../i18n/hooks/useTranslation";
import { useConditionalDisplay } from "../../../hooks/useConditionalDisplay";
import { AccessibleCheckbox } from "../../../components/AccessibleCheckbox";
import { AccessibleTextInput } from "../../../components/AccessibleTextInput";

/**
 * Safety & Address Section
 * Fields 20-25 from schema: address privacy and details
 */

interface SafetySectionProps {
  isExpanded?: boolean;
  onToggle?: () => void;
}

export const SafetySection: React.FC<
  SafetySectionProps
> = ({ isExpanded = true, onToggle }) => {
  const { formData, updateField } =
    useFormState();
  const { t } = useTranslation();

  // Show address fields only if NOT keeping address private
  const showAddressFields = useConditionalDisplay(
    "show_if:keep_address_private=false",
  );

  const isComplete =
    formData.keep_address_private !== undefined &&
    (formData.keep_address_private === true ||
      (formData.current_address_street &&
        formData.current_address_city &&
        formData.current_address_state &&
        formData.current_address_zip));

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
            {t("intake.safety.sectionTitle")}
          </span>
          {isComplete && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              ✓ {t("common.complete")}
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
              <strong>
                {t(
                  "intake.safety.privacy_warning_title",
                )}
              </strong>{" "}
              {t("intake.safety.privacy_warning")}
            </p>
          </div>

          <AccessibleCheckbox
            id="keep-address-private"
            label={t(
              "intake.safety.keep_private.label",
            )}
            checked={
              formData.keep_address_private ||
              false
            }
            onChange={(checked) =>
              updateField(
                "keep_address_private",
                checked,
              )
            }
            helpText={t(
              "intake.safety.keep_private.helpText",
            )}
          />

          {showAddressFields && (
            <>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                  {t(
                    "intake.safety.address_title",
                  )}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t(
                    "intake.safety.address_note",
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleTextInput
                  id="current-address-street"
                  label={t(
                    "intake.safety.address.street.label",
                  )}
                  value={
                    formData.current_address_street ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_street",
                      value,
                    )
                  }
                  placeholder={t(
                    "intake.safety.address.street.placeholder",
                  )}
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="current-address-apt"
                  label={t(
                    "intake.safety.address.apt.label",
                  )}
                  value={
                    formData.current_address_apt ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_apt",
                      value,
                    )
                  }
                  placeholder={t(
                    "intake.safety.address.apt.placeholder",
                  )}
                  enableVoiceInput
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AccessibleTextInput
                  id="current-address-city"
                  label={t(
                    "intake.safety.address.city.label",
                  )}
                  value={
                    formData.current_address_city ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_city",
                      value,
                    )
                  }
                  placeholder={t(
                    "intake.safety.address.city.placeholder",
                  )}
                  required
                  enableVoiceInput
                />

                <AccessibleTextInput
                  id="current-address-state"
                  label={t(
                    "intake.safety.address.state.label",
                  )}
                  value={
                    formData.current_address_state ||
                    "LA"
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_state",
                      value,
                    )
                  }
                  placeholder={t(
                    "intake.safety.address.state.placeholder",
                  )}
                  required
                />

                <AccessibleTextInput
                  id="current-address-zip"
                  label={t(
                    "intake.safety.address.zip.label",
                  )}
                  value={
                    formData.current_address_zip ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "current_address_zip",
                      value,
                    )
                  }
                  placeholder={t(
                    "intake.safety.address.zip.placeholder",
                  )}
                  required
                />
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
