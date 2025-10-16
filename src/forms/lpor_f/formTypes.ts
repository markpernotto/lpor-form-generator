// Person entry interface for dynamic lists
export interface PersonEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  relationshipToPetitioner: string;
}

export interface LPORFFormData {
  // Court Information
  courtName?: string;
  docketNumber?: string;
  division?: string;
  filedDate?: string;
  clerk?: string;
  parishCity?: string;

  // Filing Purpose (new for LPOR-F confidential address form)
  filingPurpose: {
    forPetitioner: boolean;
    forMinorChildren: boolean;
    forAllegedIncompetent: boolean;
  };

  // Petitioner Information
  petitioner: {
    firstName: string;
    maidenMiddleName: string;
    lastName: string;
    dateOfBirth: string;
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

  // Dynamic person lists for LPOR-F
  minorChildren: PersonEntry[];
  allegedIncompetent: PersonEntry[];

  // Address configuration
  sameAddressForAll: boolean;
  minorChildrenAddress: {
    street: string;
    aptNumber?: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Defendant Information
  defendant: {
    fullName: string;
    parentGuardianName?: string; // For minor defendants
    alias?: string;
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
}
