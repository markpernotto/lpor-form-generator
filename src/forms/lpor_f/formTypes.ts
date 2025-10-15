export interface LPORFFormData {
  // Court Information
  courtName?: string;
  docketNumber?: string;
  division?: string;
  filedDate?: string;
  clerk?: string;

  // Petitioner Information
  petitioner: {
    firstName: string;
    maidenMiddleName: string;
    lastName: string;
    dateOfBirth: string;
    sex: "F" | "M";
    race: string;
    address: {
      street: string;
      aptNumber?: string;
      city: string;
      state: string;
      zipCode: string;
    };
    socialSecurityNumber?: string;
    driversLicense?: {
      number: string;
      state: string;
      expiration: string;
    };
    phoneNumber?: string;
    email?: string;
  };

  // Defendant Information
  defendant: {
    fullName: string;
    guardianFullName?: string;
    alias?: string;
    dateOfBirth: string;
    sex: "F" | "M";
    race: string;
    address: {
      street: string;
      aptNumber?: string;
      city: string;
      state: string;
      zipCode: string;
    };
    socialSecurityNumber?: string;
    driversLicense?: {
      number: string;
      state: string;
      expiration: string;
    };
    phoneNumber?: string;
    email?: string;
  };

  // Protection Order Details
  protectionOrderDetails: {
    originalOrderDate: string;
    originalOrderType: (
      | "tro"
      | "preliminary"
      | "permanent"
    )[];
    originalOrderLegalBasis: (
      | "rs372"
      | "rs361"
      | "ccp3601"
    )[];
    expirationDate?: string;
    caseNumber?: string;
  };

  // Violations Details
  violations: {
    incidentDate: string;
    incidentTime?: string;
    incidentLocation: string;
    violationType: (
      | "contact"
      | "stalking"
      | "harassment"
      | "threats"
      | "property_damage"
      | "other"
    )[];
    violationDescription: string;
    witnessName?: string;
    witnessPhone?: string;
    evidenceAvailable: boolean;
    evidenceDescription?: string;
    policeNotified: boolean;
    policeReportNumber?: string;
    policeOfficer?: string;
    policeDepartment?: string;
  };

  // Requested Relief
  requestedRelief: {
    immediateArrest: boolean;
    contemptProceedings: boolean;
    orderExtension: boolean;
    additionalProtections: boolean;
    fineImposition: boolean;
    otherRelief: boolean;
    otherReliefDescription?: string;
  };

  // Emergency Request
  emergencyRequest: {
    isEmergency: boolean;
    emergencyReason?: string;
    immediateDanger: boolean;
    threatToSafety: boolean;
  };

  // Signature Section
  signatures: {
    dateOfFiling: string;
    petitionerSignature: boolean; // Will be signed manually
    attorneyName?: string;
    attorneyBarNumber?: string;
    attorneySignature?: boolean; // Will be signed manually
    notaryAcknowledgment?: boolean;
  };

  // Service Information
  serviceInfo: {
    servedOnDefendant: boolean;
    serviceDate?: string;
    serviceMethod?: string;
    processServerName?: string;
    processServerLicense?: string;
  };

  // Administrative (Court Use Only)
  administrative: {
    filingFee?: string;
    feeWaived?: boolean;
    dateReceived?: string;
    clerkInitials?: string;
    judgeAssigned?: string;
    hearingDate?: string;
    hearingTime?: string;
    pnoNumber?: string;
  };
}
