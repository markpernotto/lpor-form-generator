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
import { AccessibleSelect } from "../../components/AccessibleSelect";
import { AccessiblePersonList } from "../../components/AccessiblePersonList";
import { SuccessModal } from "../../components/SuccessModal";

// US States and Territories options for dropdown
const US_STATES_OPTIONS = [
  { value: "Alabama", label: "Alabama" },
  { value: "Alaska", label: "Alaska" },
  { value: "Arizona", label: "Arizona" },
  { value: "Arkansas", label: "Arkansas" },
  { value: "California", label: "California" },
  { value: "Colorado", label: "Colorado" },
  { value: "Connecticut", label: "Connecticut" },
  { value: "Delaware", label: "Delaware" },
  {
    value: "District of Columbia",
    label: "District of Columbia",
  },
  { value: "Florida", label: "Florida" },
  { value: "Georgia", label: "Georgia" },
  { value: "Guam", label: "Guam" },
  { value: "Hawaii", label: "Hawaii" },
  { value: "Idaho", label: "Idaho" },
  { value: "Illinois", label: "Illinois" },
  { value: "Indiana", label: "Indiana" },
  { value: "Iowa", label: "Iowa" },
  { value: "Kansas", label: "Kansas" },
  { value: "Kentucky", label: "Kentucky" },
  { value: "Louisiana", label: "Louisiana" },
  { value: "Maine", label: "Maine" },
  { value: "Maryland", label: "Maryland" },
  {
    value: "Massachusetts",
    label: "Massachusetts",
  },
  { value: "Michigan", label: "Michigan" },
  { value: "Minnesota", label: "Minnesota" },
  { value: "Mississippi", label: "Mississippi" },
  { value: "Missouri", label: "Missouri" },
  { value: "Montana", label: "Montana" },
  { value: "Nebraska", label: "Nebraska" },
  { value: "Nevada", label: "Nevada" },
  {
    value: "New Hampshire",
    label: "New Hampshire",
  },
  { value: "New Jersey", label: "New Jersey" },
  { value: "New Mexico", label: "New Mexico" },
  { value: "New York", label: "New York" },
  {
    value: "North Carolina",
    label: "North Carolina",
  },
  {
    value: "North Dakota",
    label: "North Dakota",
  },
  { value: "Ohio", label: "Ohio" },
  { value: "Oklahoma", label: "Oklahoma" },
  { value: "Oregon", label: "Oregon" },
  {
    value: "Pennsylvania",
    label: "Pennsylvania",
  },
  { value: "Puerto Rico", label: "Puerto Rico" },
  {
    value: "Rhode Island",
    label: "Rhode Island",
  },
  {
    value: "South Carolina",
    label: "South Carolina",
  },
  {
    value: "South Dakota",
    label: "South Dakota",
  },
  { value: "Tennessee", label: "Tennessee" },
  { value: "Texas", label: "Texas" },
  { value: "Utah", label: "Utah" },
  { value: "Vermont", label: "Vermont" },
  { value: "Virginia", label: "Virginia" },
  { value: "Washington", label: "Washington" },
  {
    value: "West Virginia",
    label: "West Virginia",
  },
  { value: "Wisconsin", label: "Wisconsin" },
  { value: "Wyoming", label: "Wyoming" },
];

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
      filingPurpose?: string;
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

      // Handle nested fields (2 or 3 levels deep)
      if (keys.length === 2) {
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
      }

      // Handle 3-level nested fields (e.g., petitioner.address.aptNumber)
      if (keys.length === 3) {
        const [parent, middle, child] = keys;
        const parentObj = prev[
          parent as keyof LPORFFormData
        ] as Record<string, unknown>;
        const middleObj = parentObj[
          middle
        ] as Record<string, unknown>;
        return {
          ...prev,
          [parent]: {
            ...parentObj,
            [middle]: {
              ...middleObj,
              [child]: value,
            },
          },
        };
      }

      return prev;
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
      filingPurpose?: string;
      minorChildren?: string;
      allegedIncompetent?: string;
    } = {};

    // Check if at least one filing purpose checkbox is selected
    const hasFilingPurpose =
      formData.filingPurpose.forPetitioner ||
      formData.filingPurpose.forMinorChildren ||
      formData.filingPurpose
        .forAllegedIncompetent;

    if (!hasFilingPurpose) {
      errors.filingPurpose = t(
        "lporf.filingPurpose.validationError",
      );
    }

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
    <div className="bg-white dark:bg-gray-900">
      {!showSuccessModal ? (
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("lporfForm.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t("lporfForm.subtitle")}
            </p>

            {/* Test Data Button */}
            <button
              type="button"
              onClick={populateTestData}
              className="mb-6 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
            <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t(
                  "lporfForm.filingPurpose.title",
                )}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t(
                  "lporfForm.filingPurpose.subtitle",
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

              {/* Filing Purpose Validation Error */}
              {validationErrors.filingPurpose && (
                <div
                  role="alert"
                  className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-300"
                >
                  {validationErrors.filingPurpose}
                </div>
              )}
            </section>

            {/* Petitioner Information Section */}
            <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
                  helpText={t(
                    "petitioner.dateOfBirth.helpText",
                  )}
                />
              </div>

              {/* Petitioner Address Section */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
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
                    enableVoiceInput={true}
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
                    enableVoiceInput={true}
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
                    enableVoiceInput={true}
                  />

                  <AccessibleSelect
                    id="petitioner-address-state"
                    label={`${t(
                      "petitioner.address.state.label",
                    )}`}
                    value={
                      formData.petitioner.address
                        .state
                    }
                    onChange={(value) =>
                      handleInputChange(
                        "petitioner.address.state",
                        value,
                      )
                    }
                    options={US_STATES_OPTIONS}
                    required
                  />

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
                    enableVoiceInput={true}
                  />
                </div>
              </div>
            </section>

            {/* Defendant Information Section */}
            <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
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
              <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t(
                    "lporf.minorChildren.sectionTitle",
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
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
              <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t(
                    "lporf.allegedIncompetent.sectionTitle",
                  )}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
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
                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
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
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
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

                        <AccessibleSelect
                          id="minor-children-address-state"
                          label={`${t(
                            "lporf.addresses.minorChildrenAddress.state.label",
                          )}`}
                          value={
                            formData
                              .minorChildrenAddress
                              .state
                          }
                          onChange={(value) =>
                            handleInputChange(
                              "minorChildrenAddress.state",
                              value,
                            )
                          }
                          options={
                            US_STATES_OPTIONS
                          }
                          required
                        />

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
            <section className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 dark:bg-gray-800/50">
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
                    ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                {t("common.submit")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          formType="LPOR-F"
          inline={true}
        />
      )}
    </div>
  );
};
