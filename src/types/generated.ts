/**
 * Generated Form Data Types
 * 
 * Auto-generated from schema CSV. DO NOT EDIT MANUALLY.
 * Run `npm run generate:types` to regenerate.
 * 
 * Generated: 2026-02-04T16:24:04.984Z
 */

export interface PersonEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  relationshipToPetitioner: string;
}

export interface MasterFormData {
  // Initial section
  /** Choose 'First time' if this is new, 'Update' if modifying existing petition */
  filing_type?: string;
  /** Choose 'For myself' if you need protection, 'For someone else' if helping another person */
  filing_for?: string;
  /** Select everyone who needs to be protected from harm */
  who_needs_protection?: string[];

  // Petitioner section
  /** Enter your name exactly as it appears on official documents */
  full_name?: string;
  /** Format: MM/DD/YYYY */
  birth_date?: string;
  /** You must be a Louisiana resident to use this form */
  louisiana_resident?: boolean;

  // Safety section
  /** Select YES if sharing your address could put you in danger */
  keep_address_private?: boolean;
  /** Number and street name */
  current_address_street?: string;
  /** Leave blank if not applicable */
  current_address_apt?: string | undefined;
  /** Your current city */
  current_address_city?: string;
  /** Should be Louisiana (LA) */
  current_address_state?: string;
  /** 5-digit ZIP code */
  current_address_zip?: string;

  // Children section
  /** Include all minor children (under 18) who need to be protected */
  have_children?: boolean;
  /** Enter the total number of children */
  number_of_children?: number;
  /** Enter the child's full legal name */
  child_1_name?: string;
  /** Format: MM/DD/YYYY */
  child_1_dob?: string;
  /** For example: son, daughter, stepchild, grandchild */
  child_1_relationship?: string;
  /** Select yes if children share your address */
  children_same_address?: boolean;

  // Incompetent section
  /** This includes adults with severe mental or physical disabilities */
  protecting_incompetent?: boolean;
  /** Full legal name of the person who needs protection */
  incompetent_name?: string;
  /** Format: MM/DD/YYYY */
  incompetent_dob?: string;
  /** Your relationship to the person needing protection */
  incompetent_relationship?: string;

  // Accommodations section
  /** Select yes if you need language assistance */
  need_interpreter?: boolean;
  /** Specify the language you speak */
  interpreter_language?: string;
  /** Select yes if witnesses need language help */
  witness_interpreter?: boolean;
  /** Specify witness language needs */
  witness_language?: string;

  // Defendant section
  /** Enter their legal name if you know it */
  abuser_name?: string;
  /** Select yes if the abuser is a minor */
  abuser_is_minor?: boolean;
  /** Required if abuser is under 18 */
  parent_guardian_name?: string;
  /** We need an address to serve them with court papers */
  know_abuser_address?: boolean;
  /** Select the parish/county where they reside */
  abuser_parish?: string;
  /** This can be home or work address */
  abuser_address_street?: string;
  /** Leave blank if not applicable */
  abuser_address_apt?: string | undefined;
  /** City where abuser can be found */
  abuser_address_city?: string;
  /** State (usually LA) */
  abuser_address_state?: string;
  /** 5-digit ZIP code */
  abuser_address_zip?: string;

  // Venue section
  /** This determines which court will hear your case */
  filing_parish?: string;
  /** The court needs to know why this parish has jurisdiction */
  venue_reason?: string[];

  // Relationship section
  /** This determines which type of protection order applies */
  relationship_type?: string;
  /** Include biological, adopted, or step-children */
  children_together?: boolean;

  // Legal section
  /** Answer yes if divorce proceedings have started */
  divorce_pending?: boolean;
  /** Important: This determines which form to use */
  divorce_petitioner?: string;
  /** As it appears on court documents */
  divorce_case_name?: string;
  /** Found on court documents */
  divorce_case_number?: string;
  /** Separate from divorce proceedings */
  custody_case_pending?: boolean;
  /** An existing court order about custody */
  custody_order_exists?: boolean;

  // Abuse section
  /** Select everything that has happened */
  abuse_types?: string[];
  /** This is a serious risk factor - be honest */
  choking_occurred?: boolean;
  /** Abuse during pregnancy is especially dangerous */
  pregnancy_abuse?: boolean;

  // Danger section
  /** More frequent abuse indicates increasing danger */
  abuse_increasing?: boolean;
  /** Escalating violence is a serious warning sign */
  abuse_severity?: boolean;
  /** Leaving can be a dangerous time */
  left_recently?: boolean;
  /** This is a serious risk factor */
  suicide_threats?: boolean;

  // Firearms section
  /** This includes guns they own, have in their home, car, or can easily get */
  abuser_has_guns?: boolean;
  /** Any type of weapon threat */
  gun_threats?: boolean;
  /** License to carry hidden weapons */
  concealed_carry?: boolean | undefined;
  /** Your best estimate */
  number_of_guns?: number;
  /** Select the type that best describes it */
  gun_1_type?: string;
  /** Brand, model, caliber if known */
  gun_1_details?: string | undefined;
  /** For example: bedroom, car, office */
  gun_1_location?: string | undefined;

  // Incident section
  /** This helps establish urgency */
  recent_incident_date?: string;
  /** Be specific about what they did or said. Include threats, physical violence, property damage */
  recent_incident_description?: string;
  /** Include dates if you remember them. List the most serious incidents */
  past_incidents?: string | undefined;

  // Relief section
  /** If yes, we'll request emergency protection today */
  immediate_danger?: boolean;
  /** This is the basic protection order */
  request_no_abuse?: boolean;
  /** This includes calls, texts, emails, social media, or through other people */
  request_no_contact?: boolean;
  /** Like your home, work, or children's school */
  request_stay_away?: boolean;
  /** They cannot come within 100 yards */
  stay_away_home?: boolean;
  /** This will be in the court order */
  home_address_for_order?: string;
  /** Protects your employment */
  stay_away_work?: boolean;
  /** Where you work */
  work_address?: string;
  /** Protects children at school */
  stay_away_school?: boolean;
  /** Children's school location */
  school_address?: string;

  // Property section
  /** Prevents retaliation through property damage */
  protect_property?: boolean;
  /** In the same home or apartment */
  live_together?: boolean;
  /** Court can order them to leave */
  need_exclusive_home?: boolean;
  /** Determines housing rights */
  home_ownership?: string;
  /** Pets are often used to control victims */
  keep_pets?: boolean;
  /** Type and name of pets */
  pet_description?: string;

  // Custody section
  /** During the protection order period */
  request_temp_custody?: boolean;
  /** Who has physical custody today */
  children_current_location?: string;
  /** If children are with abuser */
  need_police_retrieval?: boolean;
  /** Prevents child abduction */
  prevent_interference?: boolean;

  // Financial section
  /** Financial support for children */
  request_child_support?: boolean;
  /** Financial support for you */
  request_spousal_support?: boolean;
  /** Reimbursement for abuse-related expenses */
  request_medical_costs?: boolean;

  // Requirements section
  /** Batterer intervention program */
  require_counseling?: boolean;
  /** Court-ordered assessment */
  require_evaluation?: boolean;

  // Witness section
  /** People who can testify */
  have_witnesses?: boolean;
  /** Number who will testify */
  witness_count?: number;
  /** Court can order this */
  need_witness_criminal_check?: boolean;
  /** Legal name of witness */
  witness_1_name?: string;
  /** For background check */
  witness_1_dob?: string | undefined;

  // Court section
  /** Helps judge understand danger level */
  request_criminal_history?: boolean;
  /** After the temporary order hearing */
  want_permanent_order?: boolean;
  /** Filing fees and expenses */
  request_court_costs?: boolean;
  /** Or filing yourself (pro se) */
  have_attorney?: boolean;
  /** Your lawyer's full name */
  attorney_name?: string;
  /** Louisiana bar number */
  attorney_bar_number?: string;

  // Service section
  /** Sheriff needs to serve papers */
  service_address_type?: string;
  /** Where to serve papers */
  service_address?: string;

  // Affirmation section
  /** False statements are perjury */
  statement_true?: boolean;
  /** Criminal penalties apply */
  understand_perjury?: boolean;
  /** Date you're signing */
  signature_date?: string;
  /** Someone who sees you sign */
  witness_name?: string;

  // System section
  /** Main petition form */
  form_b_generated?: boolean | undefined;
  /** Confidential address form */
  form_f_generated?: boolean | undefined;
  /** Firearms declaration form */
  form_g_generated?: boolean | undefined;
  /** System safety flag */
  high_risk_flag?: boolean | undefined;
  /** If respondent in divorce */
  form_br_needed?: boolean | undefined;

  // Array-based collections (used by UI components)
  /** Array of children needing protection */
  children?: PersonEntry[];
  /** Array of incompetent persons needing protection */
  incompetent_persons?: PersonEntry[];
  /** Array of witnesses */
  witnesses?: PersonEntry[];
  /** Array of firearms */
  firearms?: Array<{ type: string; location: string; serial?: string }>;
  /** Detailed description of abuse incidents */
  abuse_description?: string;
  /** Temporary custody request */
  request_temporary_custody?: boolean;
  
  // Legacy field names (for backwards compatibility with existing sections)
  petitioner_full_name?: string;
  petitioner_birth_date?: string;
  petitioner_louisiana_resident?: boolean;
  venue_reasons?: string[];
  relief_requested?: string[];
  relief_other?: string;
  choking_strangulation?: boolean;
  abuse_while_pregnant?: boolean;
  disability_accommodations?: boolean;
  have_child_together?: boolean;
  pending_divorce?: boolean;
  divorce_parish?: string;
  pending_custody?: boolean;
  custody_parish?: string;
  custody_case_number?: string;
  shared_residence?: boolean;
  request_exclusive_use?: boolean;
  protect_belongings?: boolean;
  police_escort?: boolean;
  have_pets?: boolean;
  pet_details?: string;
  police_retrieve_children?: boolean;
  supervised_visitation?: boolean;
  number_of_witnesses?: number;

}
