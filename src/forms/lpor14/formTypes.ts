export interface LPORFormData {
  // Header Section
  courtName: string;
  docketNumber: string;
  division: string;
  filedDate: string;
  clerk: string;

  // Order Type
  orderType: "modify" | "dissolve";

  // Petitioner Information
  petitioner: {
    firstName: string;
    maidenMiddleName: string;
    lastName: string;
    dateOfBirth: string;
    sex: "F" | "M";
    race: string;
    protectedPersonType: "petitioner" | "others";
    otherProtectedPersons?: string;
  };

  // Defendant Information
  defendant: {
    fullName: string;
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
  };

  // Order Details
  orderDetails: {
    section1?: {
      isSelected: boolean;
      originalOrderType: (
        | "tro"
        | "preliminary"
        | "permanent"
      )[];
      originalOrderDate: string;
      originalOrderLegalBasis: (
        | "rs372"
        | "rs361"
        | "ccp3601"
      )[];
    };
    section2?: {
      isSelected: boolean;
      originalOrderType: (
        | "tro"
        | "preliminary"
        | "permanent"
      )[];
      originalOrderDate: string;
      originalOrderLegalBasis: (
        | "rs372"
        | "rs361"
        | "ccp3601"
      )[];
    };
    section3?: {
      isSelected: boolean; // Court costs
    };
  };

  // Signature Section
  signatures: {
    dateOfOrder: string;
    judgeName: string;
    // Note: Actual signatures will be left blank for manual completion
  };

  // Service Information
  serviceInfo: {
    defendantServedAtHearing: boolean;
    serviceDate?: string;
    serviceClerk?: string;
    faxedToRegistry: boolean;
    transmissionDate?: string;
    transmissionClerk?: string;
  };

  // Administrative (LPOR Use Only)
  administrative: {
    pnoNumber?: string;
    dateEntered?: string;
    initials?: string;
    verifiedBy?: string;
  };
}
