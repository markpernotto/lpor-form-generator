import type { LPORFFormData } from "./formTypes";

export const lporfFormSchema = {
  // Petitioner Personal Information (using existing formTypes structure)
  "petitioner.firstName": {
    type: "text" as const,
    required: true,
    label: "petitioner.firstName.label",
    placeholder:
      "petitioner.firstName.placeholder",
  },
  "petitioner.maidenMiddleName": {
    type: "text" as const,
    required: false,
    label: "petitioner.maidenMiddleName.label",
    placeholder:
      "petitioner.maidenMiddleName.placeholder",
  },
  "petitioner.lastName": {
    type: "text" as const,
    required: true,
    label: "petitioner.lastName.label",
    placeholder:
      "petitioner.lastName.placeholder",
  },
  "petitioner.dateOfBirth": {
    type: "date" as const,
    required: true,
    label: "petitioner.dateOfBirth.label",
  },
  "petitioner.stateOfResidence": {
    type: "select" as const,
    required: true,
    label:
      "lporf.petitioner.stateOfResidence.label",
    options: [
      { value: "Louisiana", label: "Louisiana" },
      { value: "Alabama", label: "Alabama" },
      { value: "Arkansas", label: "Arkansas" },
      { value: "Florida", label: "Florida" },
      { value: "Georgia", label: "Georgia" },
      {
        value: "Mississippi",
        label: "Mississippi",
      },
      { value: "Tennessee", label: "Tennessee" },
      { value: "Texas", label: "Texas" },
    ],
  },

  // Defendant Information (using existing formTypes structure)
  "defendant.fullName": {
    type: "text" as const,
    required: true,
    label: "defendant.fullName.label",
    placeholder: "defendant.fullName.placeholder",
  },
  "defendant.dateOfBirth": {
    type: "date" as const,
    required: true,
    label: "defendant.dateOfBirth.label",
  },
  "defendant.guardianFullName": {
    type: "text" as const,
    required: false,
    label: "defendant.guardianFullName.label",
    placeholder:
      "defendant.guardianFullName.placeholder",
  },

  // Filing Purpose (Paragraph 1) - Checkboxes for who the petition is filed for
  "filingPurpose.forPetitioner": {
    type: "checkbox" as const,
    required: false,
    label:
      "lporf.filingPurpose.forPetitioner.label",
  },
  "filingPurpose.forMinorChildren": {
    type: "checkbox" as const,
    required: false,
    label:
      "lporf.filingPurpose.forMinorChildren.label",
  },
  "filingPurpose.forAllegedIncompetent": {
    type: "checkbox" as const,
    required: false,
    label:
      "lporf.filingPurpose.forAllegedIncompetent.label",
  },

  // Petitioner Address Information
  "petitioner.address.street": {
    type: "text" as const,
    required: true,
    label: "petitioner.address.street.label",
    placeholder:
      "petitioner.address.street.placeholder",
  },
  "petitioner.address.aptNumber": {
    type: "text" as const,
    required: false,
    label: "petitioner.address.aptNumber.label",
    placeholder:
      "petitioner.address.aptNumber.placeholder",
  },
  "petitioner.address.city": {
    type: "text" as const,
    required: true,
    label: "petitioner.address.city.label",
    placeholder:
      "petitioner.address.city.placeholder",
  },
  "petitioner.address.state": {
    type: "select" as const,
    required: true,
    label: "petitioner.address.state.label",
    options: [
      { value: "LA", label: "Louisiana" },
      { value: "AL", label: "Alabama" },
      { value: "AR", label: "Arkansas" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "MS", label: "Mississippi" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
    ],
  },
  "petitioner.address.zipCode": {
    type: "text" as const,
    required: true,
    label: "petitioner.address.zipCode.label",
    placeholder:
      "petitioner.address.zipCode.placeholder",
  },

  // Same address checkbox helper
  sameAddressForAll: {
    type: "checkbox" as const,
    required: false,
    label:
      "lporf.addresses.sameAddressForAll.label",
  },

  // Minor Children/Incompetent Address (conditional - shown only if different from petitioner)
  "minorChildrenAddress.street": {
    type: "text" as const,
    required: false,
    label:
      "lporf.addresses.minorChildrenAddress.street.label",
    placeholder:
      "lporf.addresses.minorChildrenAddress.street.placeholder",
  },
  "minorChildrenAddress.aptNumber": {
    type: "text" as const,
    required: false,
    label:
      "lporf.addresses.minorChildrenAddress.aptNumber.label",
    placeholder:
      "lporf.addresses.minorChildrenAddress.aptNumber.placeholder",
  },
  "minorChildrenAddress.city": {
    type: "text" as const,
    required: false,
    label:
      "lporf.addresses.minorChildrenAddress.city.label",
    placeholder:
      "lporf.addresses.minorChildrenAddress.city.placeholder",
  },
  "minorChildrenAddress.state": {
    type: "select" as const,
    required: false,
    label:
      "lporf.addresses.minorChildrenAddress.state.label",
    options: [
      { value: "LA", label: "Louisiana" },
      { value: "AL", label: "Alabama" },
      { value: "AR", label: "Arkansas" },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "MS", label: "Mississippi" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
    ],
  },
  "minorChildrenAddress.zipCode": {
    type: "text" as const,
    required: false,
    label:
      "lporf.addresses.minorChildrenAddress.zipCode.label",
    placeholder:
      "lporf.addresses.minorChildrenAddress.zipCode.placeholder",
  },
};

// Default values for new LPOR-F form (using existing formTypes structure)
export const getDefaultLPORFFormData =
  (): LPORFFormData => ({
    petitioner: {
      firstName: "",
      maidenMiddleName: "",
      lastName: "",
      dateOfBirth: "",
      sex: "F",
      race: "",
      address: {
        street: "",
        aptNumber: "",
        city: "",
        state: "LA",
        zipCode: "",
      },
      socialSecurityNumber: "",
      driversLicense: {
        number: "",
        state: "",
        expiration: "",
      },
      phoneNumber: "",
      email: "",
    },

    defendant: {
      fullName: "",
      guardianFullName: "",
      alias: "",
      dateOfBirth: "",
      sex: "F",
      race: "",
      address: {
        street: "",
        aptNumber: "",
        city: "",
        state: "",
        zipCode: "",
      },
      socialSecurityNumber: "",
      driversLicense: {
        number: "",
        state: "",
        expiration: "",
      },
      phoneNumber: "",
      email: "",
    },

    protectionOrderDetails: {
      originalOrderDate: "",
      originalOrderType: [],
      originalOrderLegalBasis: [],
      expirationDate: "",
      caseNumber: "",
    },

    violations: {
      incidentDate: "",
      incidentTime: "",
      incidentLocation: "",
      violationType: [],
      violationDescription: "",
      witnessName: "",
      witnessPhone: "",
      evidenceAvailable: false,
      evidenceDescription: "",
      policeNotified: false,
      policeReportNumber: "",
      policeOfficer: "",
      policeDepartment: "",
    },

    requestedRelief: {
      immediateArrest: false,
      contemptProceedings: false,
      orderExtension: false,
      additionalProtections: false,
      fineImposition: false,
      otherRelief: false,
      otherReliefDescription: "",
    },

    emergencyRequest: {
      isEmergency: false,
      emergencyReason: "",
      immediateDanger: false,
      threatToSafety: false,
    },

    signatures: {
      dateOfFiling: "",
      petitionerSignature: false,
      attorneyName: "",
      attorneyBarNumber: "",
      attorneySignature: false,
      notaryAcknowledgment: false,
    },

    serviceInfo: {
      servedOnDefendant: false,
      serviceDate: "",
      serviceMethod: "",
      processServerName: "",
      processServerLicense: "",
    },

    administrative: {
      filingFee: "",
      feeWaived: false,
      dateReceived: "",
      clerkInitials: "",
      judgeAssigned: "",
      hearingDate: "",
      hearingTime: "",
      pnoNumber: "",
    },
  });

// Test data for LPOR-F form (minimal test data)
export const getTestLPORFFormData =
  (): LPORFFormData => ({
    ...getDefaultLPORFFormData(),

    petitioner: {
      firstName: "Sarah",
      maidenMiddleName: "Marie",
      lastName: "Johnson",
      dateOfBirth: "1985-06-15",
      sex: "F",
      race: "Caucasian",
      address: {
        street: "1234 Safe House Lane",
        aptNumber: "Unit B",
        city: "New Orleans",
        state: "LA",
        zipCode: "70115",
      },
      socialSecurityNumber: "123-45-6789",
      driversLicense: {
        number: "D1234567",
        state: "LA",
        expiration: "2025-06-15",
      },
      phoneNumber: "(555) 123-4567",
      email: "sarah.johnson@email.com",
    },

    defendant: {
      fullName: "Robert Wilson",
      guardianFullName: "",
      alias: "",
      dateOfBirth: "1980-03-22",
      sex: "M",
      race: "Caucasian",
      address: {
        street: "456 Other Street",
        aptNumber: "",
        city: "New Orleans",
        state: "LA",
        zipCode: "70116",
      },
      socialSecurityNumber: "",
      driversLicense: {
        number: "",
        state: "",
        expiration: "",
      },
      phoneNumber: "",
      email: "",
    },
  });
