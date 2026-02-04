/**
 * Static Form Options
 *
 * Dropdown options, checkbox values, and other static data for the intake form.
 * Data derived from LA Bar Domestic Abuse Questions Schema.
 */

export interface SelectOption {
  value: string;
  label: string;
}

// Louisiana Parishes (alphabetical, without "Parish" suffix)
export const LOUISIANA_PARISHES: SelectOption[] =
  [
    { value: "Acadia", label: "Acadia" },
    { value: "Allen", label: "Allen" },
    { value: "Ascension", label: "Ascension" },
    { value: "Assumption", label: "Assumption" },
    { value: "Avoyelles", label: "Avoyelles" },
    { value: "Beauregard", label: "Beauregard" },
    { value: "Bienville", label: "Bienville" },
    { value: "Bossier", label: "Bossier" },
    { value: "Caddo", label: "Caddo" },
    { value: "Calcasieu", label: "Calcasieu" },
    { value: "Caldwell", label: "Caldwell" },
    { value: "Cameron", label: "Cameron" },
    { value: "Catahoula", label: "Catahoula" },
    { value: "Claiborne", label: "Claiborne" },
    { value: "Concordia", label: "Concordia" },
    { value: "DeSoto", label: "DeSoto" },
    {
      value: "East Baton Rouge",
      label: "East Baton Rouge",
    },
    {
      value: "East Carroll",
      label: "East Carroll",
    },
    {
      value: "East Feliciana",
      label: "East Feliciana",
    },
    { value: "Evangeline", label: "Evangeline" },
    { value: "Franklin", label: "Franklin" },
    { value: "Grant", label: "Grant" },
    { value: "Iberia", label: "Iberia" },
    { value: "Iberville", label: "Iberville" },
    { value: "Jackson", label: "Jackson" },
    { value: "Jefferson", label: "Jefferson" },
    {
      value: "Jefferson Davis",
      label: "Jefferson Davis",
    },
    { value: "Lafayette", label: "Lafayette" },
    { value: "Lafourche", label: "Lafourche" },
    { value: "LaSalle", label: "LaSalle" },
    { value: "Lincoln", label: "Lincoln" },
    { value: "Livingston", label: "Livingston" },
    { value: "Madison", label: "Madison" },
    { value: "Morehouse", label: "Morehouse" },
    {
      value: "Natchitoches",
      label: "Natchitoches",
    },
    { value: "Orleans", label: "Orleans" },
    { value: "Ouachita", label: "Ouachita" },
    {
      value: "Plaquemines",
      label: "Plaquemines",
    },
    {
      value: "Pointe Coupee",
      label: "Pointe Coupee",
    },
    { value: "Rapides", label: "Rapides" },
    { value: "Red River", label: "Red River" },
    { value: "Richland", label: "Richland" },
    { value: "Sabine", label: "Sabine" },
    {
      value: "St. Bernard",
      label: "St. Bernard",
    },
    {
      value: "St. Charles",
      label: "St. Charles",
    },
    { value: "St. Helena", label: "St. Helena" },
    { value: "St. James", label: "St. James" },
    { value: "St. John", label: "St. John" },
    { value: "St. Landry", label: "St. Landry" },
    { value: "St. Martin", label: "St. Martin" },
    { value: "St. Mary", label: "St. Mary" },
    {
      value: "St. Tammany",
      label: "St. Tammany",
    },
    { value: "Tangipahoa", label: "Tangipahoa" },
    { value: "Tensas", label: "Tensas" },
    { value: "Terrebonne", label: "Terrebonne" },
    { value: "Union", label: "Union" },
    { value: "Vermilion", label: "Vermilion" },
    { value: "Vernon", label: "Vernon" },
    { value: "Washington", label: "Washington" },
    { value: "Webster", label: "Webster" },
    {
      value: "West Baton Rouge",
      label: "West Baton Rouge",
    },
    {
      value: "West Carroll",
      label: "West Carroll",
    },
    {
      value: "West Feliciana",
      label: "West Feliciana",
    },
    { value: "Winn", label: "Winn" },
  ];

// Child Relationship Types (field 34)
export const CHILD_RELATIONSHIPS: SelectOption[] =
  [
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "stepson", label: "Stepson" },
    {
      value: "stepdaughter",
      label: "Stepdaughter",
    },
    { value: "grandchild", label: "Grandchild" },
    { value: "ward", label: "Ward" },
    { value: "other", label: "Other" },
  ];

// Primary Relationship Types (field 80)
export const RELATIONSHIP_TYPES: SelectOption[] =
  [
    {
      value: "current_spouse",
      label: "Current Spouse",
    },
    {
      value: "former_spouse",
      label: "Former Spouse",
    },
    { value: "dating", label: "Dating" },
    {
      value: "former_dating",
      label: "Former Dating Partner",
    },
    {
      value: "living_together",
      label: "Living Together",
    },
    { value: "parent", label: "Parent" },
    { value: "stepparent", label: "Stepparent" },
    { value: "child", label: "Child" },
    { value: "stepchild", label: "Stepchild" },
    {
      value: "grandparent",
      label: "Grandparent",
    },
    { value: "grandchild", label: "Grandchild" },
    {
      value: "other_family",
      label: "Other Family Member",
    },
  ];

// Venue Reasons (field 71) - Checkboxes
export const VENUE_REASONS: SelectOption[] = [
  {
    value: "marital_home",
    label:
      "Former marital home is in this parish",
  },
  {
    value: "household",
    label: "Common household is in this parish",
  },
  {
    value: "defendant_lives",
    label: "Defendant lives in this parish",
  },
  {
    value: "abuse_occurred",
    label: "Abuse occurred in this parish",
  },
  {
    value: "i_live_here",
    label: "I live in this parish",
  },
];

// Abuse Types (field 100) - Checkboxes
export const ABUSE_TYPES: SelectOption[] = [
  { value: "slapped", label: "Slapped" },
  { value: "punched", label: "Punched" },
  {
    value: "choked",
    label: "Choked or strangled",
  },
  { value: "shoved", label: "Shoved or pushed" },
  { value: "kicked", label: "Kicked" },
  {
    value: "stalked",
    label: "Stalked or followed",
  },
  {
    value: "threatened_harm",
    label: "Threatened to harm",
  },
  {
    value: "threatened_life",
    label: "Threatened to kill",
  },
  {
    value: "threatened_weapon",
    label: "Threatened with a weapon",
  },
  {
    value: "sexual_abuse",
    label: "Sexual abuse",
  },
  {
    value: "child_abuse",
    label: "Abused children",
  },
  {
    value: "pet_abuse",
    label: "Hurt or killed pets",
  },
  {
    value: "pregnancy_abuse",
    label: "Hurt during pregnancy",
  },
];

// Home Ownership Status (field 153)
export const HOME_OWNERSHIP: SelectOption[] = [
  { value: "i_own", label: "I own" },
  { value: "they_own", label: "They own" },
  { value: "both_own", label: "We both own" },
  { value: "i_lease", label: "I lease/rent" },
  {
    value: "they_lease",
    label: "They lease/rent",
  },
  {
    value: "both_lease",
    label: "We both lease/rent",
  },
];

// Current Child Location (field 161)
export const CHILD_LOCATIONS: SelectOption[] = [
  { value: "with_me", label: "With me" },
  {
    value: "with_abuser",
    label: "With the abuser",
  },
  {
    value: "with_relative",
    label: "With a relative",
  },
  { value: "other", label: "Other location" },
];

// Firearm Types (field 124)
export const FIREARM_TYPES: SelectOption[] = [
  { value: "handgun", label: "Handgun/Pistol" },
  { value: "rifle", label: "Rifle" },
  { value: "shotgun", label: "Shotgun" },
  {
    value: "assault_rifle",
    label: "Assault Rifle",
  },
  { value: "machine_gun", label: "Machine Gun" },
  { value: "unknown", label: "Unknown Type" },
];

// Service Address Type (field 210)
export const SERVICE_ADDRESS_TYPES: SelectOption[] =
  [
    { value: "home", label: "Home address" },
    { value: "work", label: "Work address" },
    { value: "other", label: "Other address" },
  ];

// Filing Types (field 1)
export const FILING_TYPES: SelectOption[] = [
  {
    value: "initial",
    label: "First time filing",
  },
  {
    value: "supplemental",
    label: "Updating previous petition",
  },
];

// Who Filling For (field 2)
export const FILING_FOR_OPTIONS: SelectOption[] =
  [
    { value: "self", label: "For myself" },
    {
      value: "behalf",
      label: "For someone else",
    },
  ];

// Who Needs Protection (field 3) - Checkboxes
export const WHO_NEEDS_PROTECTION: SelectOption[] =
  [
    { value: "self", label: "Myself" },
    {
      value: "children",
      label: "Minor children",
    },
    {
      value: "incompetent",
      label:
        "Someone who cannot protect themselves",
    },
  ];

// Divorce Petitioner (field 91)
export const DIVORCE_PETITIONER: SelectOption[] =
  [
    {
      value: "i_filed",
      label: "I filed for divorce",
    },
    {
      value: "they_filed",
      label: "They filed for divorce",
    },
  ];
