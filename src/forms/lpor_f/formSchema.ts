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
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      {
        value: "DC",
        label: "District of Columbia",
      },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "GU", label: "Guam" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PA", label: "Pennsylvania" },
      { value: "PR", label: "Puerto Rico" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" },
    ],
  },

  // Defendant Information (using existing formTypes structure)
  "defendant.fullName": {
    type: "text" as const,
    required: true,
    label: "defendant.fullName.label",
    placeholder: "defendant.fullName.placeholder",
  },
  "defendant.parentGuardianName": {
    type: "text" as const,
    required: false,
    label: "defendant.parentGuardianName.label",
    placeholder:
      "defendant.parentGuardianName.placeholder",
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
      { value: "AL", label: "Alabama" },
      { value: "AK", label: "Alaska" },
      { value: "AZ", label: "Arizona" },
      { value: "AR", label: "Arkansas" },
      { value: "CA", label: "California" },
      { value: "CO", label: "Colorado" },
      { value: "CT", label: "Connecticut" },
      { value: "DE", label: "Delaware" },
      {
        value: "DC",
        label: "District of Columbia",
      },
      { value: "FL", label: "Florida" },
      { value: "GA", label: "Georgia" },
      { value: "GU", label: "Guam" },
      { value: "HI", label: "Hawaii" },
      { value: "ID", label: "Idaho" },
      { value: "IL", label: "Illinois" },
      { value: "IN", label: "Indiana" },
      { value: "IA", label: "Iowa" },
      { value: "KS", label: "Kansas" },
      { value: "KY", label: "Kentucky" },
      { value: "LA", label: "Louisiana" },
      { value: "ME", label: "Maine" },
      { value: "MD", label: "Maryland" },
      { value: "MA", label: "Massachusetts" },
      { value: "MI", label: "Michigan" },
      { value: "MN", label: "Minnesota" },
      { value: "MS", label: "Mississippi" },
      { value: "MO", label: "Missouri" },
      { value: "MT", label: "Montana" },
      { value: "NE", label: "Nebraska" },
      { value: "NV", label: "Nevada" },
      { value: "NH", label: "New Hampshire" },
      { value: "NJ", label: "New Jersey" },
      { value: "NM", label: "New Mexico" },
      { value: "NY", label: "New York" },
      { value: "NC", label: "North Carolina" },
      { value: "ND", label: "North Dakota" },
      { value: "OH", label: "Ohio" },
      { value: "OK", label: "Oklahoma" },
      { value: "OR", label: "Oregon" },
      { value: "PA", label: "Pennsylvania" },
      { value: "PR", label: "Puerto Rico" },
      { value: "RI", label: "Rhode Island" },
      { value: "SC", label: "South Carolina" },
      { value: "SD", label: "South Dakota" },
      { value: "TN", label: "Tennessee" },
      { value: "TX", label: "Texas" },
      { value: "UT", label: "Utah" },
      { value: "VT", label: "Vermont" },
      { value: "VA", label: "Virginia" },
      { value: "WA", label: "Washington" },
      { value: "WV", label: "West Virginia" },
      { value: "WI", label: "Wisconsin" },
      { value: "WY", label: "Wyoming" },
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
    // Filing Purpose
    filingPurpose: {
      forPetitioner: false,
      forMinorChildren: false,
      forAllegedIncompetent: false,
    },

    petitioner: {
      firstName: "",
      maidenMiddleName: "",
      lastName: "",
      dateOfBirth: "",
      stateOfResidence: "LA",
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

    // Dynamic person lists
    minorChildren: [],
    allegedIncompetent: [],

    // Address configuration
    sameAddressForAll: true,
    minorChildrenAddress: {
      street: "",
      aptNumber: "",
      city: "",
      state: "LA",
      zipCode: "",
    },

    defendant: {
      fullName: "",
      parentGuardianName: "",
      alias: "",
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
  });

// Test data for LPOR-F form (minimal test data)
export const getTestLPORFFormData =
  (): LPORFFormData => ({
    ...getDefaultLPORFFormData(),

    // Override filing purpose for test
    filingPurpose: {
      forPetitioner: true,
      forMinorChildren: true,
      forAllegedIncompetent: false,
    },

    minorChildrenAddress: {
      street: "8080 Test Ave",
      aptNumber: "Apt 4878",
      city: "Baton Rouge",
      state: "LA",
      zipCode: "70802",
    },

    petitioner: {
      firstName: "Sarah",
      maidenMiddleName: "Marie",
      lastName: "Johnson",
      dateOfBirth: "1985-06-15",
      stateOfResidence: "LA",
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
      parentGuardianName: "",
      alias: "",
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
