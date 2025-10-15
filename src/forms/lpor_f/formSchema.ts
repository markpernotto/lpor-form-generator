import type { LPORFFormData } from "./formTypes";

export const lporfFormSchema = {
  // Header fields - Court Information (can be pre-populated via query params)
  courtName: {
    type: "text" as const,
    required: false, // Can be left blank or pre-populated
    label: "court.courtName.label",
    placeholder: "court.courtName.placeholder",
  },
  docketNumber: {
    type: "text" as const,
    required: false, // Can be left blank or pre-populated
    label: "court.docketNumber.label",
    placeholder: "court.docketNumber.placeholder",
  },
  division: {
    type: "text" as const,
    required: false, // Can be left blank or pre-populated
    label: "court.division.label",
    placeholder: "court.division.placeholder",
  },
  filedDate: {
    type: "date" as const,
    required: false, // Can be left blank or pre-populated
    label: "court.filedDate.label",
  },
  clerk: {
    type: "text" as const,
    required: false,
    label: "court.clerk.label",
    placeholder: "court.clerk.placeholder",
  },

  // Petitioner fields
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
  "petitioner.sex": {
    type: "select" as const,
    required: true,
    label: "petitioner.sex.label",
    options: [
      {
        value: "F",
        label: "petitioner.sex.options.female",
      },
      {
        value: "M",
        label: "petitioner.sex.options.male",
      },
    ],
  },
  "petitioner.race": {
    type: "text" as const,
    required: false,
    label: "petitioner.race.label",
    placeholder: "petitioner.race.placeholder",
  },

  // Defendant fields
  "defendant.fullName": {
    type: "text" as const,
    required: true,
    label: "defendant.fullName.label",
    placeholder: "defendant.fullName.placeholder",
  },
  "defendant.alias": {
    type: "text" as const,
    required: false,
    label: "defendant.alias.label",
    placeholder: "defendant.alias.placeholder",
  },
  "defendant.dateOfBirth": {
    type: "date" as const,
    required: true,
    label: "defendant.dateOfBirth.label",
  },
  "defendant.sex": {
    type: "select" as const,
    required: true,
    label: "defendant.sex.label",
    options: [
      {
        value: "F",
        label: "defendant.sex.options.female",
      },
      {
        value: "M",
        label: "defendant.sex.options.male",
      },
    ],
  },
  "defendant.race": {
    type: "text" as const,
    required: false,
    label: "defendant.race.label",
    placeholder: "defendant.race.placeholder",
  },

  // Protection Order Details
  "protectionOrderDetails.originalOrderDate": {
    type: "date" as const,
    required: true,
    label:
      "protectionOrder.originalOrderDate.label",
  },
  "protectionOrderDetails.originalOrderType": {
    type: "checkbox" as const,
    required: true,
    label:
      "protectionOrder.originalOrderType.label",
    options: [
      {
        value: "tro",
        label:
          "protectionOrder.originalOrderType.options.tro",
      },
      {
        value: "preliminary",
        label:
          "protectionOrder.originalOrderType.options.preliminary",
      },
      {
        value: "permanent",
        label:
          "protectionOrder.originalOrderType.options.permanent",
      },
    ],
  },
  "protectionOrderDetails.expirationDate": {
    type: "date" as const,
    required: false,
    label: "protectionOrder.expirationDate.label",
  },

  // Violations
  "violations.incidentDate": {
    type: "date" as const,
    required: true,
    label: "violations.incidentDate.label",
  },
  "violations.incidentTime": {
    type: "time" as const,
    required: false,
    label: "violations.incidentTime.label",
  },
  "violations.incidentLocation": {
    type: "text" as const,
    required: true,
    label: "violations.incidentLocation.label",
    placeholder:
      "violations.incidentLocation.placeholder",
  },
  "violations.violationType": {
    type: "checkbox" as const,
    required: true,
    label: "violations.violationType.label",
    options: [
      {
        value: "contact",
        label:
          "violations.violationType.options.contact",
      },
      {
        value: "stalking",
        label:
          "violations.violationType.options.stalking",
      },
      {
        value: "harassment",
        label:
          "violations.violationType.options.harassment",
      },
      {
        value: "threats",
        label:
          "violations.violationType.options.threats",
      },
      {
        value: "property_damage",
        label:
          "violations.violationType.options.propertyDamage",
      },
      {
        value: "other",
        label:
          "violations.violationType.options.other",
      },
    ],
  },
  "violations.violationDescription": {
    type: "textarea" as const,
    required: true,
    label:
      "violations.violationDescription.label",
    placeholder:
      "violations.violationDescription.placeholder",
  },
  "violations.policeNotified": {
    type: "radio" as const,
    required: true,
    label: "violations.policeNotified.label",
    options: [
      { value: "true", label: "common.yes" },
      { value: "false", label: "common.no" },
    ],
  },

  // Requested Relief
  "requestedRelief.immediateArrest": {
    type: "checkbox" as const,
    required: false,
    label:
      "requestedRelief.immediateArrest.label",
  },
  "requestedRelief.contemptProceedings": {
    type: "checkbox" as const,
    required: false,
    label:
      "requestedRelief.contemptProceedings.label",
  },
  "requestedRelief.orderExtension": {
    type: "checkbox" as const,
    required: false,
    label: "requestedRelief.orderExtension.label",
  },

  // Emergency Request
  "emergencyRequest.isEmergency": {
    type: "radio" as const,
    required: true,
    label: "emergencyRequest.isEmergency.label",
    options: [
      { value: "true", label: "common.yes" },
      { value: "false", label: "common.no" },
    ],
  },
  "emergencyRequest.emergencyReason": {
    type: "textarea" as const,
    required: false,
    label:
      "emergencyRequest.emergencyReason.label",
    placeholder:
      "emergencyRequest.emergencyReason.placeholder",
  },

  // Signatures
  "signatures.dateOfFiling": {
    type: "date" as const,
    required: true,
    label: "signatures.dateOfFiling.label",
  },
  "signatures.attorneyName": {
    type: "text" as const,
    required: false,
    label: "signatures.attorneyName.label",
    placeholder:
      "signatures.attorneyName.placeholder",
  },
};

// Default values for new form
export const getDefaultLPORFFormData =
  (): LPORFFormData => ({
    courtName: "",
    docketNumber: "",
    division: "",
    filedDate: "",
    clerk: "",

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

    defendant: {
      fullName: "",
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

// Test data population
export const getTestLPORFFormData =
  (): LPORFFormData => ({
    courtName:
      "Superior Court of Los Angeles County",
    docketNumber: "23STRO12345",
    division: "Department 1",
    filedDate: "2024-01-15",
    clerk: "J. Smith",

    petitioner: {
      firstName: "Jane",
      maidenMiddleName: "Marie",
      lastName: "Doe",
      dateOfBirth: "1985-03-15",
      sex: "F",
      race: "Caucasian",
      address: {
        street: "123 Main Street",
        aptNumber: "Apt 2B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
      },
      socialSecurityNumber: "123-45-6789",
      driversLicense: {
        number: "D1234567",
        state: "CA",
        expiration: "2025-03-15",
      },
      phoneNumber: "(555) 123-4567",
      email: "jane.doe@email.com",
    },

    defendant: {
      fullName: "John Michael Smith",
      alias: "Mike Smith",
      dateOfBirth: "1980-07-22",
      sex: "M",
      race: "Caucasian",
      address: {
        street: "456 Oak Avenue",
        aptNumber: "",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90211",
      },
      socialSecurityNumber: "987-65-4321",
      driversLicense: {
        number: "D7654321",
        state: "CA",
        expiration: "2024-07-22",
      },
      phoneNumber: "(555) 987-6543",
      email: "john.smith@email.com",
    },

    protectionOrderDetails: {
      originalOrderDate: "2023-12-01",
      originalOrderType: ["preliminary"],
      originalOrderLegalBasis: ["rs372"],
      expirationDate: "2024-12-01",
      caseNumber: "23STRO11111",
    },

    violations: {
      incidentDate: "2024-01-10",
      incidentTime: "14:30",
      incidentLocation:
        "123 Main Street, Los Angeles, CA",
      violationType: ["contact", "harassment"],
      violationDescription:
        "Defendant approached petitioner at home despite restraining order, made threatening gestures and verbal threats.",
      witnessName: "Mary Johnson",
      witnessPhone: "(555) 111-2222",
      evidenceAvailable: true,
      evidenceDescription:
        "Text messages, security camera footage",
      policeNotified: true,
      policeReportNumber: "24-001234",
      policeOfficer: "Officer Wilson",
      policeDepartment: "LAPD",
    },

    requestedRelief: {
      immediateArrest: true,
      contemptProceedings: true,
      orderExtension: true,
      additionalProtections: false,
      fineImposition: false,
      otherRelief: false,
      otherReliefDescription: "",
    },

    emergencyRequest: {
      isEmergency: true,
      emergencyReason:
        "Defendant has escalated threats and violated order multiple times",
      immediateDanger: true,
      threatToSafety: true,
    },

    signatures: {
      dateOfFiling: "2024-01-15",
      petitionerSignature: true,
      attorneyName: "Sarah Thompson, Esq.",
      attorneyBarNumber: "CA12345",
      attorneySignature: true,
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
      filingFee: "$50.00",
      feeWaived: false,
      dateReceived: "2024-01-15",
      clerkInitials: "JS",
      judgeAssigned: "Hon. Robert Martinez",
      hearingDate: "2024-01-25",
      hearingTime: "09:00",
      pnoNumber: "PNO-2024-001",
    },
  });
