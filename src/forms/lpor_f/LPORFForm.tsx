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

  // State for validation errors
  const [validationErrors, setValidationErrors] =
    useState<{
      minorChildren?: string;
      allegedIncompetent?: string;
    }>({});

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

    // Validate filing purpose requirements
    const errors: {
      minorChildren?: string;
      allegedIncompetent?: string;
    } = {};

    // Check if minor children checkbox is checked but no children added
    if (
      formData.filingPurpose.forMinorChildren &&
      formData.minorChildren.length === 0
    ) {
      errors.minorChildren = t(
        "lporf.minorChildren.validationError",
      );
    }

    // Check if alleged incompetent checkbox is checked but no incompetent persons added
    if (
      formData.filingPurpose
        .forAllegedIncompetent &&
      formData.allegedIncompetent.length === 0
    ) {
      errors.allegedIncompetent = t(
        "lporf.allegedIncompetent.validationError",
      );
    }

    // If there are validation errors, set them and prevent submission
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      // Scroll to first error
      const firstErrorElement =
        document.querySelector('[role="alert"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});

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
                  )}`}
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
                  )}`}
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
                  )}`}
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
              </div>

              {/* Petitioner Address Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {t(
                    "petitioner.address.sectionTitle",
                  )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AccessibleTextInput
                    id="petitioner-address-street"
                    label={`${t(
                      "petitioner.address.street.label",
                    )}`}
                    value={
                      formData.petitioner.address
                        .street
                    }
                    onChange={(value) =>
                      handleInputChange(
                        "petitioner.address.street",
                        value,
                      )
                    }
                    placeholder={t(
                      "petitioner.address.street.placeholder",
                    )}
                    required
                  />

                  <AccessibleTextInput
                    id="petitioner-address-apt"
                    label={t(
                      "petitioner.address.aptNumber.label",
                    )}
                    value={
                      formData.petitioner.address
                        .aptNumber || ""
                    }
                    onChange={(value) =>
                      handleInputChange(
                        "petitioner.address.aptNumber",
                        value,
                      )
                    }
                    placeholder={t(
                      "petitioner.address.aptNumber.placeholder",
                    )}
                  />

                  <AccessibleTextInput
                    id="petitioner-address-city"
                    label={`${t(
                      "petitioner.address.city.label",
                    )}`}
                    value={
                      formData.petitioner.address
                        .city
                    }
                    onChange={(value) =>
                      handleInputChange(
                        "petitioner.address.city",
                        value,
                      )
                    }
                    placeholder={t(
                      "petitioner.address.city.placeholder",
                    )}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t(
                        "petitioner.address.state.label",
                      )}{" "}
                    </label>
                    <select
                      value={
                        formData.petitioner
                          .address.state
                      }
                      onChange={(e) =>
                        handleInputChange(
                          "petitioner.address.state",
                          e.target.value,
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Alabama">
                        Alabama
                      </option>
                      <option value="Alaska">
                        Alaska
                      </option>
                      <option value="Arizona">
                        Arizona
                      </option>
                      <option value="Arkansas">
                        Arkansas
                      </option>
                      <option value="California">
                        California
                      </option>
                      <option value="Colorado">
                        Colorado
                      </option>
                      <option value="Connecticut">
                        Connecticut
                      </option>
                      <option value="Delaware">
                        Delaware
                      </option>
                      <option value="District of Columbia">
                        District of Columbia
                      </option>
                      <option value="Florida">
                        Florida
                      </option>
                      <option value="Georgia">
                        Georgia
                      </option>
                      <option value="Guam">
                        Guam
                      </option>
                      <option value="Hawaii">
                        Hawaii
                      </option>
                      <option value="Idaho">
                        Idaho
                      </option>
                      <option value="Illinois">
                        Illinois
                      </option>
                      <option value="Indiana">
                        Indiana
                      </option>
                      <option value="Iowa">
                        Iowa
                      </option>
                      <option value="Kansas">
                        Kansas
                      </option>
                      <option value="Kentucky">
                        Kentucky
                      </option>
                      <option value="Louisiana">
                        Louisiana
                      </option>
                      <option value="Maine">
                        Maine
                      </option>
                      <option value="Maryland">
                        Maryland
                      </option>
                      <option value="Massachusetts">
                        Massachusetts
                      </option>
                      <option value="Michigan">
                        Michigan
                      </option>
                      <option value="Minnesota">
                        Minnesota
                      </option>
                      <option value="Mississippi">
                        Mississippi
                      </option>
                      <option value="Missouri">
                        Missouri
                      </option>
                      <option value="Montana">
                        Montana
                      </option>
                      <option value="Nebraska">
                        Nebraska
                      </option>
                      <option value="Nevada">
                        Nevada
                      </option>
                      <option value="New Hampshire">
                        New Hampshire
                      </option>
                      <option value="New Jersey">
                        New Jersey
                      </option>
                      <option value="New Mexico">
                        New Mexico
                      </option>
                      <option value="New York">
                        New York
                      </option>
                      <option value="North Carolina">
                        North Carolina
                      </option>
                      <option value="North Dakota">
                        North Dakota
                      </option>
                      <option value="Ohio">
                        Ohio
                      </option>
                      <option value="Oklahoma">
                        Oklahoma
                      </option>
                      <option value="Oregon">
                        Oregon
                      </option>
                      <option value="Pennsylvania">
                        Pennsylvania
                      </option>
                      <option value="Puerto Rico">
                        Puerto Rico
                      </option>
                      <option value="Rhode Island">
                        Rhode Island
                      </option>
                      <option value="South Carolina">
                        South Carolina
                      </option>
                      <option value="South Dakota">
                        South Dakota
                      </option>
                      <option value="Tennessee">
                        Tennessee
                      </option>
                      <option value="Texas">
                        Texas
                      </option>
                      <option value="Utah">
                        Utah
                      </option>
                      <option value="Vermont">
                        Vermont
                      </option>
                      <option value="Virginia">
                        Virginia
                      </option>
                      <option value="Washington">
                        Washington
                      </option>
                      <option value="West Virginia">
                        West Virginia
                      </option>
                      <option value="Wisconsin">
                        Wisconsin
                      </option>
                      <option value="Wyoming">
                        Wyoming
                      </option>
                    </select>
                  </div>

                  <AccessibleTextInput
                    id="petitioner-address-zip"
                    label={`${t(
                      "petitioner.address.zipCode.label",
                    )}`}
                    value={
                      formData.petitioner.address
                        .zipCode
                    }
                    onChange={(value) =>
                      handleInputChange(
                        "petitioner.address.zipCode",
                        value,
                      )
                    }
                    placeholder={t(
                      "petitioner.address.zipCode.placeholder",
                    )}
                    required
                  />
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
                  )}`}
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
                  helpText={t(
                    "defendant.fullName.helpText",
                  )}
                />

                {/* Parent/Guardian Name for Minor Defendants */}
                <AccessibleTextInput
                  id="defendant-parent-guardian"
                  label={t(
                    "defendant.parentGuardianName.label",
                  )}
                  value={
                    formData.defendant
                      .parentGuardianName || ""
                  }
                  onChange={(value) =>
                    handleInputChange(
                      "defendant.parentGuardianName",
                      value,
                    )
                  }
                  placeholder={t(
                    "defendant.parentGuardianName.placeholder",
                  )}
                  enableVoiceInput={true}
                  helpText={t(
                    "defendant.parentGuardianName.helpText",
                  )}
                />
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
                  maxEntries={6}
                  maxEntriesMessage={t(
                    "lporf.minorChildren.maxEntriesMessage",
                  )}
                  error={
                    validationErrors.minorChildren
                  }
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
                  maxEntries={2}
                  maxEntriesMessage={t(
                    "lporf.allegedIncompetent.maxEntriesMessage",
                  )}
                  error={
                    validationErrors.allegedIncompetent
                  }
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

                {/* Warning about different addresses */}
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800">
                    <strong>
                      {t(
                        "common.success.important",
                      )}
                    </strong>{" "}
                    {t(
                      "lporf.addresses.differentAddressWarning",
                    )}
                  </p>
                </div>

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
                            <option value="Alabama">
                              Alabama
                            </option>
                            <option value="Alaska">
                              Alaska
                            </option>
                            <option value="Arizona">
                              Arizona
                            </option>
                            <option value="Arkansas">
                              Arkansas
                            </option>
                            <option value="California">
                              California
                            </option>
                            <option value="Colorado">
                              Colorado
                            </option>
                            <option value="Connecticut">
                              Connecticut
                            </option>
                            <option value="Delaware">
                              Delaware
                            </option>
                            <option value="District of Columbia">
                              District of Columbia
                            </option>
                            <option value="Florida">
                              Florida
                            </option>
                            <option value="Georgia">
                              Georgia
                            </option>
                            <option value="Guam">
                              Guam
                            </option>
                            <option value="Hawaii">
                              Hawaii
                            </option>
                            <option value="Idaho">
                              Idaho
                            </option>
                            <option value="Illinois">
                              Illinois
                            </option>
                            <option value="Indiana">
                              Indiana
                            </option>
                            <option value="Iowa">
                              Iowa
                            </option>
                            <option value="Kansas">
                              Kansas
                            </option>
                            <option value="Kentucky">
                              Kentucky
                            </option>
                            <option value="Louisiana">
                              Louisiana
                            </option>
                            <option value="Maine">
                              Maine
                            </option>
                            <option value="Maryland">
                              Maryland
                            </option>
                            <option value="Massachusetts">
                              Massachusetts
                            </option>
                            <option value="Michigan">
                              Michigan
                            </option>
                            <option value="Minnesota">
                              Minnesota
                            </option>
                            <option value="Mississippi">
                              Mississippi
                            </option>
                            <option value="Missouri">
                              Missouri
                            </option>
                            <option value="Montana">
                              Montana
                            </option>
                            <option value="Nebraska">
                              Nebraska
                            </option>
                            <option value="Nevada">
                              Nevada
                            </option>
                            <option value="New Hampshire">
                              New Hampshire
                            </option>
                            <option value="New Jersey">
                              New Jersey
                            </option>
                            <option value="New Mexico">
                              New Mexico
                            </option>
                            <option value="New York">
                              New York
                            </option>
                            <option value="North Carolina">
                              North Carolina
                            </option>
                            <option value="North Dakota">
                              North Dakota
                            </option>
                            <option value="Ohio">
                              Ohio
                            </option>
                            <option value="Oklahoma">
                              Oklahoma
                            </option>
                            <option value="Oregon">
                              Oregon
                            </option>
                            <option value="Pennsylvania">
                              Pennsylvania
                            </option>
                            <option value="Puerto Rico">
                              Puerto Rico
                            </option>
                            <option value="Rhode Island">
                              Rhode Island
                            </option>
                            <option value="South Carolina">
                              South Carolina
                            </option>
                            <option value="South Dakota">
                              South Dakota
                            </option>
                            <option value="Tennessee">
                              Tennessee
                            </option>
                            <option value="Texas">
                              Texas
                            </option>
                            <option value="Utah">
                              Utah
                            </option>
                            <option value="Vermont">
                              Vermont
                            </option>
                            <option value="Virginia">
                              Virginia
                            </option>
                            <option value="Washington">
                              Washington
                            </option>
                            <option value="West Virginia">
                              West Virginia
                            </option>
                            <option value="Wisconsin">
                              Wisconsin
                            </option>
                            <option value="Wyoming">
                              Wyoming
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
              </section>
            )}

            {/* Confirmation Section */}
            <section className="border border-gray-200 rounded-lg p-6">
              <AccessibleCheckbox
                id="form-confirmation"
                label={t(
                  "common.confirmation.label",
                )}
                checked={confirmationChecked}
                onChange={setConfirmationChecked}
                required
                helpText={t(
                  "common.confirmation.helpText",
                )}
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
