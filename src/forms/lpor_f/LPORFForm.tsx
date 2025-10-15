import React, {
  useState,
  useEffect,
} from "react";
import type { LPORFFormData } from "./formTypes";
import {
  getDefaultLPORFFormData,
  getTestLPORFFormData,
} from "./formSchema";
import { useTranslation } from "../../i18n/hooks/useTranslation";
import { AccessibleTextInput } from "../../components/AccessibleTextInput";
import { AccessibleDateInput } from "../../components/AccessibleDateInput";
import { AccessibleTextarea } from "../../components/AccessibleTextarea";
import { AccessibleCheckbox } from "../../components/AccessibleCheckbox";
import { AccessibleRadioGroup } from "../../components/AccessibleRadioGroup";
import { SuccessModal } from "../../components/SuccessModal";

interface LPORFFormProps {
  onSubmit?: (data: LPORFFormData) => void;
  initialData?: Partial<LPORFFormData>;
}

export const LPORFForm: React.FC<
  LPORFFormProps
> = ({ onSubmit, initialData }) => {
  const { t } = useTranslation();
  const [formData, setFormData] =
    useState<LPORFFormData>(
      getDefaultLPORFFormData(),
    );

  // State for form confirmation
  const [
    confirmationChecked,
    setConfirmationChecked,
  ] = useState(false);

  // State for success modal
  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  // Update form data when initialData changes (court information only)
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        // Only merge court information fields
        ...(initialData.courtName !==
          undefined && {
          courtName: initialData.courtName,
        }),
        ...(initialData.docketNumber !==
          undefined && {
          docketNumber: initialData.docketNumber,
        }),
        ...(initialData.division !==
          undefined && {
          division: initialData.division,
        }),
        ...(initialData.filedDate !==
          undefined && {
          filedDate: initialData.filedDate,
        }),
      }));
    }
  }, [initialData]);

  const handleInputChange = (
    field: string,
    value: string | boolean | string[],
  ) => {
    setFormData((prev) => {
      const keys = field.split(".");
      if (keys.length === 1) {
        return { ...prev, [field]: value };
      }

      // Handle nested fields
      const [parent, child] = keys;
      const parentObj = prev[
        parent as keyof LPORFFormData
      ] as Record<string, unknown>;
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [child]: value,
        },
      };
    });
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const keys = field.split(".");
      const currentArray =
        keys.length === 1
          ? (prev[
              field as keyof LPORFFormData
            ] as string[])
          : ((
              prev[
                keys[0] as keyof LPORFFormData
              ] as Record<string, unknown>
            )[keys[1]] as string[]);

      const newArray = checked
        ? [...currentArray, value]
        : currentArray.filter(
            (item) => item !== value,
          );

      if (keys.length === 1) {
        return { ...prev, [field]: newArray };
      }

      const [parent, child] = keys;
      const parentObj = prev[
        parent as keyof LPORFFormData
      ] as Record<string, unknown>;
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [child]: newArray,
        },
      };
    });
  };

  const populateTestData = () => {
    const testData = getTestLPORFFormData();
    setFormData((prev) => ({
      ...testData,
      // Preserve court information from query parameters
      courtName:
        prev.courtName || testData.courtName,
      docketNumber:
        prev.docketNumber ||
        testData.docketNumber,
      division:
        prev.division || testData.division,
      filedDate:
        prev.filedDate || testData.filedDate,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the original onSubmit handler (for PDF generation)
    onSubmit?.(formData);

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);

    // Reset form to default state
    setFormData(getDefaultLPORFFormData());

    // Reset confirmation checkbox
    setConfirmationChecked(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {!showSuccessModal ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("lporfForm.title")}
            </h1>
            <p className="text-gray-600 mb-4">
              {t("lporfForm.subtitle")}
            </p>

            {/* Test Data Button */}
            <button
              type="button"
              onClick={populateTestData}
              className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {t("common.populateTestData")}
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Court Information Section - Hidden from UI but data preserved for PDF */}
            {/* Court information is pre-populated from query parameters and passed to PDF generator */}
            {/* Users do not edit these fields directly - they are handled behind the scenes */}

            {/* Petitioner Information Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("petitioner.sectionTitle")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleTextInput
                  id="petitioner-firstName"
                  label={`${t(
                    "petitioner.firstName.label",
                  )} *`}
                  value={
                    formData.petitioner.firstName
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "petitioner.firstName",
                      value,
                    )
                  }
                  placeholder={t(
                    "petitioner.firstName.placeholder",
                  )}
                  required
                  enableVoiceInput={true}
                  autoComplete="given-name"
                />

                <AccessibleTextInput
                  id="petitioner-lastName"
                  label={`${t(
                    "petitioner.lastName.label",
                  )} *`}
                  value={
                    formData.petitioner.lastName
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "petitioner.lastName",
                      value,
                    )
                  }
                  placeholder={t(
                    "petitioner.lastName.placeholder",
                  )}
                  required
                  enableVoiceInput={true}
                  autoComplete="family-name"
                />

                <AccessibleDateInput
                  id="petitioner-dateOfBirth"
                  label={`${t(
                    "petitioner.dateOfBirth.label",
                  )} *`}
                  value={
                    formData.petitioner
                      .dateOfBirth
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "petitioner.dateOfBirth",
                      value,
                    )
                  }
                  type="date"
                  required
                  helpText="Enter your date of birth"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("petitioner.sex.label")} *
                  </label>
                  <select
                    value={
                      formData.petitioner.sex
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "petitioner.sex",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="F">
                      {t(
                        "petitioner.sex.options.female",
                      )}
                    </option>
                    <option value="M">
                      {t(
                        "petitioner.sex.options.male",
                      )}
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* Defendant Information Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("defendant.sectionTitle")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleTextInput
                  id="defendant-fullName"
                  label={`${t(
                    "defendant.fullName.label",
                  )} *`}
                  value={
                    formData.defendant.fullName
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "defendant.fullName",
                      value,
                    )
                  }
                  placeholder={t(
                    "defendant.fullName.placeholder",
                  )}
                  required
                  enableVoiceInput={true}
                  autoComplete="name"
                  helpText="Enter the full legal name of the defendant"
                />

                <AccessibleDateInput
                  id="defendant-dateOfBirth"
                  label={`${t(
                    "defendant.dateOfBirth.label",
                  )} *`}
                  value={
                    formData.defendant.dateOfBirth
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "defendant.dateOfBirth",
                      value,
                    )
                  }
                  type="date"
                  required
                  helpText="Enter the defendant's date of birth"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("defendant.sex.label")} *
                  </label>
                  <select
                    value={formData.defendant.sex}
                    onChange={(e) =>
                      handleInputChange(
                        "defendant.sex",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="F">
                      {t(
                        "defendant.sex.options.female",
                      )}
                    </option>
                    <option value="M">
                      {t(
                        "defendant.sex.options.male",
                      )}
                    </option>
                  </select>
                </div>
              </div>
            </section>

            {/* Protection Order Details Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(
                  "protectionOrder.sectionTitle",
                )}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "protectionOrder.originalOrderDate.label",
                    )}{" "}
                    *
                  </label>
                  <input
                    type="date"
                    value={
                      formData
                        .protectionOrderDetails
                        .originalOrderDate
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "protectionOrderDetails.originalOrderDate",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "protectionOrder.expirationDate.label",
                    )}
                  </label>
                  <input
                    type="date"
                    value={
                      formData
                        .protectionOrderDetails
                        .expirationDate || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "protectionOrderDetails.expirationDate",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    "protectionOrder.originalOrderType.label",
                  )}{" "}
                  *
                </label>
                <div className="space-y-2">
                  {[
                    {
                      value: "tro",
                      label: t(
                        "protectionOrder.originalOrderType.options.tro",
                      ),
                    },
                    {
                      value: "preliminary",
                      label: t(
                        "protectionOrder.originalOrderType.options.preliminary",
                      ),
                    },
                    {
                      value: "permanent",
                      label: t(
                        "protectionOrder.originalOrderType.options.permanent",
                      ),
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={formData.protectionOrderDetails.originalOrderType.includes(
                          option.value as
                            | "tro"
                            | "preliminary"
                            | "permanent",
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "protectionOrderDetails.originalOrderType",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Violations Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t("violations.sectionTitle")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "violations.incidentDate.label",
                    )}{" "}
                    *
                  </label>
                  <input
                    type="date"
                    value={
                      formData.violations
                        .incidentDate
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "violations.incidentDate",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <AccessibleDateInput
                  id="violations-incidentTime"
                  label={t(
                    "violations.incidentTime.label",
                  )}
                  value={
                    formData.violations
                      .incidentTime || ""
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "violations.incidentTime",
                      value,
                    )
                  }
                  type="time"
                  helpText="Enter the approximate time of the incident"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t(
                    "violations.incidentLocation.label",
                  )}{" "}
                  *
                </label>
                <input
                  type="text"
                  value={
                    formData.violations
                      .incidentLocation
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "violations.incidentLocation",
                      e.target.value,
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t(
                    "violations.incidentLocation.placeholder",
                  )}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    "violations.violationType.label",
                  )}{" "}
                  *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "contact",
                      label: t(
                        "violations.violationType.options.contact",
                      ),
                    },
                    {
                      value: "stalking",
                      label: t(
                        "violations.violationType.options.stalking",
                      ),
                    },
                    {
                      value: "harassment",
                      label: t(
                        "violations.violationType.options.harassment",
                      ),
                    },
                    {
                      value: "threats",
                      label: t(
                        "violations.violationType.options.threats",
                      ),
                    },
                    {
                      value: "property_damage",
                      label: t(
                        "violations.violationType.options.propertyDamage",
                      ),
                    },
                    {
                      value: "other",
                      label: t(
                        "violations.violationType.options.other",
                      ),
                    },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        checked={formData.violations.violationType.includes(
                          option.value as
                            | "contact"
                            | "stalking"
                            | "harassment"
                            | "threats"
                            | "property_damage"
                            | "other",
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(
                            "violations.violationType",
                            option.value,
                            e.target.checked,
                          )
                        }
                        className="mr-2"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <AccessibleTextarea
                  id="violations-violationDescription"
                  label={`${t(
                    "violations.violationDescription.label",
                  )} *`}
                  value={
                    formData.violations
                      .violationDescription
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "violations.violationDescription",
                      value,
                    )
                  }
                  placeholder={t(
                    "violations.violationDescription.placeholder",
                  )}
                  rows={4}
                  required
                  enableVoiceInput={true}
                  helpText="Describe the violation in detail"
                />
              </div>

              <AccessibleRadioGroup
                name="policeNotified"
                label={`${t(
                  "violations.policeNotified.label",
                )} *`}
                value={
                  formData.violations
                    .policeNotified
                    ? "true"
                    : "false"
                }
                onChange={(value) =>
                  handleInputChange(
                    "violations.policeNotified",
                    value === "true",
                  )
                }
                options={[
                  {
                    value: "true",
                    label: t("common.yes"),
                    helpText:
                      "Check if police were notified of this incident",
                  },
                  {
                    value: "false",
                    label: t("common.no"),
                    helpText:
                      "Check if police were NOT notified",
                  },
                ]}
                required
                helpText="Were police notified about this violation?"
                layout="vertical"
              />
            </section>

            {/* Emergency Request Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(
                  "emergencyRequest.sectionTitle",
                )}
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t(
                    "emergencyRequest.isEmergency.label",
                  )}{" "}
                  *
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isEmergency"
                      checked={
                        formData.emergencyRequest
                          .isEmergency === true
                      }
                      onChange={() =>
                        handleInputChange(
                          "emergencyRequest.isEmergency",
                          true,
                        )
                      }
                      className="mr-2"
                    />
                    {t("common.yes")}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isEmergency"
                      checked={
                        formData.emergencyRequest
                          .isEmergency === false
                      }
                      onChange={() =>
                        handleInputChange(
                          "emergencyRequest.isEmergency",
                          false,
                        )
                      }
                      className="mr-2"
                    />
                    {t("common.no")}
                  </label>
                </div>
              </div>

              {formData.emergencyRequest
                .isEmergency && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "emergencyRequest.emergencyReason.label",
                    )}
                  </label>
                  <textarea
                    value={
                      formData.emergencyRequest
                        .emergencyReason || ""
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "emergencyRequest.emergencyReason",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={t(
                      "emergencyRequest.emergencyReason.placeholder",
                    )}
                    rows={3}
                  />
                </div>
              )}
            </section>

            {/* Confirmation Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <AccessibleCheckbox
                id="form-confirmation"
                label="I confirm that all information provided is accurate and complete"
                checked={confirmationChecked}
                onChange={setConfirmationChecked}
                required
                helpText="Please review all information before submitting. This confirmation is required to proceed."
              />
            </section>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!confirmationChecked}
                className={`px-6 py-3 font-medium rounded transition-colors ${
                  confirmationChecked
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("common.submit")}
              </button>
            </div>
          </form>
        </>
      ) : null}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        formType="LPOR-F"
      />
    </div>
  );
};
