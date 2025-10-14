import React, { useState } from "react";
import type { LPORFFormData } from "./formTypes";
import {
  getDefaultLPORFFormData,
  getTestLPORFFormData,
} from "./formSchema";
import { useTranslation } from "../../i18n/hooks/useTranslation";

interface LPORFFormProps {
  onSubmit?: (data: LPORFFormData) => void;
}

export const LPORFForm: React.FC<
  LPORFFormProps
> = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [formData, setFormData] =
    useState<LPORFFormData>(
      getDefaultLPORFFormData(),
    );

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
    setFormData(getTestLPORFFormData());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
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
        {/* Court Information Section */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("court.sectionTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("court.courtName.label")} *
              </label>
              <input
                type="text"
                value={formData.courtName}
                onChange={(e) =>
                  handleInputChange(
                    "courtName",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "court.courtName.placeholder",
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("court.docketNumber.label")}
              </label>
              <input
                type="text"
                value={formData.docketNumber}
                onChange={(e) =>
                  handleInputChange(
                    "docketNumber",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "court.docketNumber.placeholder",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("court.division.label")}
              </label>
              <input
                type="text"
                value={formData.division}
                onChange={(e) =>
                  handleInputChange(
                    "division",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "court.division.placeholder",
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("court.filedDate.label")} *
              </label>
              <input
                type="date"
                value={formData.filedDate}
                onChange={(e) =>
                  handleInputChange(
                    "filedDate",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Petitioner Information Section */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("petitioner.sectionTitle")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("petitioner.firstName.label")}{" "}
                *
              </label>
              <input
                type="text"
                value={
                  formData.petitioner.firstName
                }
                onChange={(e) =>
                  handleInputChange(
                    "petitioner.firstName",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "petitioner.firstName.placeholder",
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("petitioner.lastName.label")} *
              </label>
              <input
                type="text"
                value={
                  formData.petitioner.lastName
                }
                onChange={(e) =>
                  handleInputChange(
                    "petitioner.lastName",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "petitioner.lastName.placeholder",
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(
                  "petitioner.dateOfBirth.label",
                )}{" "}
                *
              </label>
              <input
                type="date"
                value={
                  formData.petitioner.dateOfBirth
                }
                onChange={(e) =>
                  handleInputChange(
                    "petitioner.dateOfBirth",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("petitioner.sex.label")} *
              </label>
              <select
                value={formData.petitioner.sex}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("defendant.fullName.label")} *
              </label>
              <input
                type="text"
                value={
                  formData.defendant.fullName
                }
                onChange={(e) =>
                  handleInputChange(
                    "defendant.fullName",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t(
                  "defendant.fullName.placeholder",
                )}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("defendant.dateOfBirth.label")}{" "}
                *
              </label>
              <input
                type="date"
                value={
                  formData.defendant.dateOfBirth
                }
                onChange={(e) =>
                  handleInputChange(
                    "defendant.dateOfBirth",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

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
            {t("protectionOrder.sectionTitle")}
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
                  formData.protectionOrderDetails
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
                  formData.protectionOrderDetails
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
                  formData.violations.incidentDate
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t(
                  "violations.incidentTime.label",
                )}
              </label>
              <input
                type="time"
                value={
                  formData.violations
                    .incidentTime || ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "violations.incidentTime",
                    e.target.value,
                  )
                }
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t(
                "violations.violationDescription.label",
              )}{" "}
              *
            </label>
            <textarea
              value={
                formData.violations
                  .violationDescription
              }
              onChange={(e) =>
                handleInputChange(
                  "violations.violationDescription",
                  e.target.value,
                )
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={t(
                "violations.violationDescription.placeholder",
              )}
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t(
                "violations.policeNotified.label",
              )}{" "}
              *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="policeNotified"
                  checked={
                    formData.violations
                      .policeNotified === true
                  }
                  onChange={() =>
                    handleInputChange(
                      "violations.policeNotified",
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
                  name="policeNotified"
                  checked={
                    formData.violations
                      .policeNotified === false
                  }
                  onChange={() =>
                    handleInputChange(
                      "violations.policeNotified",
                      false,
                    )
                  }
                  className="mr-2"
                />
                {t("common.no")}
              </label>
            </div>
          </div>
        </section>

        {/* Emergency Request Section */}
        <section className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t("emergencyRequest.sectionTitle")}
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors"
          >
            {t("common.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};
