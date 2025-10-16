import React, {
  useState,
  useEffect,
} from "react";
import type {
  LPORFFormData,
  PersonEntry,
} from "./formTypes";
import {
  getDefaultLPORFFormData,
  getTestLPORFFormData,
} from "./formSchema";
import { useTranslation } from "../../i18n/hooks/useTranslation";
import { AccessibleTextInput } from "../../components/AccessibleTextInput";
import { AccessibleDateInput } from "../../components/AccessibleDateInput";
import { AccessibleCheckbox } from "../../components/AccessibleCheckbox";
import { AccessiblePersonList } from "../../components/AccessiblePersonList";
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
        ...(initialData.clerk !== undefined && {
          clerk: initialData.clerk,
        }),
        ...(initialData.parishCity !==
          undefined && {
          parishCity: initialData.parishCity,
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

  // Helper function for handling person list updates
  const handlePersonListChange = (
    field: "minorChildren" | "allegedIncompetent",
    entries: PersonEntry[],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: entries,
    }));
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

            {/* Filing Purpose Section - New for LPOR-F Confidential Address Form */}
            <section className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {t(
                  "lporf.filingPurpose.sectionTitle",
                )}
              </h2>
              <p className="text-gray-600 mb-4">
                {t(
                  "lporf.filingPurpose.description",
                )}
              </p>

              <div className="space-y-3">
                <AccessibleCheckbox
                  id="filing-purpose-petitioner"
                  label={t(
                    "lporf.filingPurpose.forPetitioner.label",
                  )}
                  checked={
                    formData.filingPurpose
                      .forPetitioner
                  }
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      filingPurpose: {
                        ...prev.filingPurpose,
                        forPetitioner: checked,
                      },
                    }))
                  }
                />

                <AccessibleCheckbox
                  id="filing-purpose-minor-children"
                  label={t(
                    "lporf.filingPurpose.forMinorChildren.label",
                  )}
                  checked={
                    formData.filingPurpose
                      .forMinorChildren
                  }
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      filingPurpose: {
                        ...prev.filingPurpose,
                        forMinorChildren: checked,
                      },
                    }))
                  }
                />

                <AccessibleCheckbox
                  id="filing-purpose-alleged-incompetent"
                  label={t(
                    "lporf.filingPurpose.forAllegedIncompetent.label",
                  )}
                  checked={
                    formData.filingPurpose
                      .forAllegedIncompetent
                  }
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      filingPurpose: {
                        ...prev.filingPurpose,
                        forAllegedIncompetent:
                          checked,
                      },
                    }))
                  }
                />
              </div>
            </section>

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

                {/* New field for LPOR-F: State of Residence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t(
                      "lporf.petitioner.stateOfResidence.label",
                    )}{" "}
                    *
                  </label>
                  <select
                    value={
                      formData.petitioner
                        .stateOfResidence
                    }
                    onChange={(e) =>
                      handleInputChange(
                        "petitioner.stateOfResidence",
                        e.target.value,
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="Louisiana">
                      Louisiana
                    </option>
                    <option value="Alabama">
                      Alabama
                    </option>
                    <option value="Arkansas">
                      Arkansas
                    </option>
                    <option value="Florida">
                      Florida
                    </option>
                    <option value="Georgia">
                      Georgia
                    </option>
                    <option value="Mississippi">
                      Mississippi
                    </option>
                    <option value="Tennessee">
                      Tennessee
                    </option>
                    <option value="Texas">
                      Texas
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

            {/* Minor Children Section - New for LPOR-F */}
            {formData.filingPurpose
              .forMinorChildren && (
              <section className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t(
                    "lporf.minorChildren.sectionTitle",
                  )}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t(
                    "lporf.minorChildren.description",
                  )}
                </p>

                <AccessiblePersonList
                  id="minor-children-list"
                  label={t(
                    "lporf.minorChildren.listLabel",
                  )}
                  description={t(
                    "lporf.minorChildren.listDescription",
                  )}
                  entries={formData.minorChildren}
                  onEntriesChange={(entries) =>
                    handlePersonListChange(
                      "minorChildren",
                      entries,
                    )
                  }
                  addButtonText={t(
                    "lporf.minorChildren.addButtonText",
                  )}
                  emptyStateText={t(
                    "lporf.minorChildren.emptyStateText",
                  )}
                  nameLabel={t(
                    "lporf.minorChildren.nameLabel",
                  )}
                  dobLabel={t(
                    "lporf.minorChildren.dobLabel",
                  )}
                  relationshipLabel={t(
                    "lporf.minorChildren.relationshipLabel",
                  )}
                  namePlaceholder={t(
                    "lporf.minorChildren.namePlaceholder",
                  )}
                  relationshipPlaceholder={t(
                    "lporf.minorChildren.relationshipPlaceholder",
                  )}
                />
              </section>
            )}

            {/* Alleged Incompetent Persons Section - New for LPOR-F */}
            {formData.filingPurpose
              .forAllegedIncompetent && (
              <section className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t(
                    "lporf.allegedIncompetent.sectionTitle",
                  )}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t(
                    "lporf.allegedIncompetent.description",
                  )}
                </p>

                <AccessiblePersonList
                  id="alleged-incompetent-list"
                  label={t(
                    "lporf.allegedIncompetent.listLabel",
                  )}
                  description={t(
                    "lporf.allegedIncompetent.listDescription",
                  )}
                  entries={
                    formData.allegedIncompetent
                  }
                  onEntriesChange={(entries) =>
                    handlePersonListChange(
                      "allegedIncompetent",
                      entries,
                    )
                  }
                  addButtonText={t(
                    "lporf.allegedIncompetent.addButtonText",
                  )}
                  emptyStateText={t(
                    "lporf.allegedIncompetent.emptyStateText",
                  )}
                  nameLabel={t(
                    "lporf.allegedIncompetent.nameLabel",
                  )}
                  dobLabel={t(
                    "lporf.allegedIncompetent.dobLabel",
                  )}
                  relationshipLabel={t(
                    "lporf.allegedIncompetent.relationshipLabel",
                  )}
                  namePlaceholder={t(
                    "lporf.allegedIncompetent.namePlaceholder",
                  )}
                  relationshipPlaceholder={t(
                    "lporf.allegedIncompetent.relationshipPlaceholder",
                  )}
                />
              </section>
            )}

            {/* Address Configuration Section - New for LPOR-F */}
            {(formData.filingPurpose
              .forMinorChildren ||
              formData.filingPurpose
                .forAllegedIncompetent) && (
              <section className="border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {t(
                    "lporf.addresses.sectionTitle",
                  )}
                </h2>
                <p className="text-gray-600 mb-4">
                  {t(
                    "lporf.addresses.description",
                  )}
                </p>

                <AccessibleCheckbox
                  id="same-address-for-all"
                  label={t(
                    "lporf.addresses.sameAddressForAll.label",
                  )}
                  checked={
                    formData.sameAddressForAll
                  }
                  onChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      sameAddressForAll: checked,
                    }))
                  }
                />

                {/* Conditional address sections based on same address setting */}
                {!formData.sameAddressForAll &&
                  formData.filingPurpose
                    .forMinorChildren && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t(
                          "lporf.addresses.minorChildrenAddress.title",
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AccessibleTextInput
                          id="minor-children-address-street"
                          label={t(
                            "lporf.addresses.minorChildrenAddress.street.label",
                          )}
                          value={
                            formData
                              .minorChildrenAddress
                              .street
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "minorChildrenAddress.street",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.minorChildrenAddress.street.placeholder",
                          )}
                          required
                        />

                        <AccessibleTextInput
                          id="minor-children-address-apt"
                          label={t(
                            "lporf.addresses.minorChildrenAddress.aptNumber.label",
                          )}
                          value={
                            formData
                              .minorChildrenAddress
                              .aptNumber || ""
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "minorChildrenAddress.aptNumber",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.minorChildrenAddress.aptNumber.placeholder",
                          )}
                        />

                        <AccessibleTextInput
                          id="minor-children-address-city"
                          label={t(
                            "lporf.addresses.minorChildrenAddress.city.label",
                          )}
                          value={
                            formData
                              .minorChildrenAddress
                              .city
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "minorChildrenAddress.city",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.minorChildrenAddress.city.placeholder",
                          )}
                          required
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t(
                              "lporf.addresses.minorChildrenAddress.state.label",
                            )}{" "}
                            *
                          </label>
                          <select
                            value={
                              formData
                                .minorChildrenAddress
                                .state
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "minorChildrenAddress.state",
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="LA">
                              Louisiana
                            </option>
                            <option value="AL">
                              Alabama
                            </option>
                            <option value="AR">
                              Arkansas
                            </option>
                            <option value="FL">
                              Florida
                            </option>
                            <option value="GA">
                              Georgia
                            </option>
                            <option value="MS">
                              Mississippi
                            </option>
                            <option value="TN">
                              Tennessee
                            </option>
                            <option value="TX">
                              Texas
                            </option>
                          </select>
                        </div>

                        <AccessibleTextInput
                          id="minor-children-address-zip"
                          label={t(
                            "lporf.addresses.minorChildrenAddress.zipCode.label",
                          )}
                          value={
                            formData
                              .minorChildrenAddress
                              .zipCode
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "minorChildrenAddress.zipCode",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.minorChildrenAddress.zipCode.placeholder",
                          )}
                          required
                        />
                      </div>
                    </div>
                  )}

                {!formData.sameAddressForAll &&
                  formData.filingPurpose
                    .forAllegedIncompetent && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {t(
                          "lporf.addresses.allegedIncompetentAddress.title",
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AccessibleTextInput
                          id="alleged-incompetent-address-street"
                          label={t(
                            "lporf.addresses.allegedIncompetentAddress.street.label",
                          )}
                          value={
                            formData
                              .allegedIncompetentAddress
                              .street
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "allegedIncompetentAddress.street",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.allegedIncompetentAddress.street.placeholder",
                          )}
                          required
                        />

                        <AccessibleTextInput
                          id="alleged-incompetent-address-apt"
                          label={t(
                            "lporf.addresses.allegedIncompetentAddress.aptNumber.label",
                          )}
                          value={
                            formData
                              .allegedIncompetentAddress
                              .aptNumber || ""
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "allegedIncompetentAddress.aptNumber",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.allegedIncompetentAddress.aptNumber.placeholder",
                          )}
                        />

                        <AccessibleTextInput
                          id="alleged-incompetent-address-city"
                          label={t(
                            "lporf.addresses.allegedIncompetentAddress.city.label",
                          )}
                          value={
                            formData
                              .allegedIncompetentAddress
                              .city
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "allegedIncompetentAddress.city",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.allegedIncompetentAddress.city.placeholder",
                          )}
                          required
                        />

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t(
                              "lporf.addresses.allegedIncompetentAddress.state.label",
                            )}{" "}
                            *
                          </label>
                          <select
                            value={
                              formData
                                .allegedIncompetentAddress
                                .state
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "allegedIncompetentAddress.state",
                                e.target.value,
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          >
                            <option value="LA">
                              Louisiana
                            </option>
                            <option value="AL">
                              Alabama
                            </option>
                            <option value="AR">
                              Arkansas
                            </option>
                            <option value="FL">
                              Florida
                            </option>
                            <option value="GA">
                              Georgia
                            </option>
                            <option value="MS">
                              Mississippi
                            </option>
                            <option value="TN">
                              Tennessee
                            </option>
                            <option value="TX">
                              Texas
                            </option>
                          </select>
                        </div>

                        <AccessibleTextInput
                          id="alleged-incompetent-address-zip"
                          label={t(
                            "lporf.addresses.allegedIncompetentAddress.zipCode.label",
                          )}
                          value={
                            formData
                              .allegedIncompetentAddress
                              .zipCode
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "allegedIncompetentAddress.zipCode",
                              value,
                            )
                          }
                          placeholder={t(
                            "lporf.addresses.allegedIncompetentAddress.zipCode.placeholder",
                          )}
                          required
                        />
                      </div>
                    </div>
                  )}
              </section>
            )}

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
