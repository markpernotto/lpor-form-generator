import {
  writeFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { generateLPORCPDF } from "../src/forms/lpor_c/pdfGenerator.ts";
import type { MasterFormData } from "../src/types/generated.ts";

async function main() {
  const testData: MasterFormData & {
    debug_fill_all_fields?: boolean;
  } = {
    // Submission-gate fields
    filing_type: "initial",
    form_br_needed: true,
    filing_for: "self",
    petitioner_full_name: "Maria R. Johnson",
    full_name: "Maria Renee Johnson",
    birth_date: "1989-04-18",
    petitioner_birth_date: "1989-04-18",
    louisiana_resident: true,
    petitioner_louisiana_resident: true,
    abuser_name: "Derek Anthony Johnson Jr.",
    abuser_parish: "East Baton Rouge",
    abuser_address_street: "4100 Oak Ridge Drive",
    abuser_address_apt: "4B",
    abuser_address_city: "Baton Rouge",
    abuser_address_state: "LA",
    abuser_address_zip: "70809",
    statement_true: true,
    understand_perjury: true,
    signature_date: "2026-02-25",
    witness_name: "Case Worker A",

    // Address / safety
    keep_address_private: false,
    current_address_street: "245 Harbor Lane",
    current_address_apt: "12C",
    current_address_city: "Baton Rouge",
    current_address_state: "LA",
    current_address_zip: "70808",

    // Venue / relationship / legal status
    filing_parish:
      "East Baton Rouge Parish Sheriff's Office",
    venue_reasons: [
      "marital_home",
      "household",
      "defendant_lives",
      "abuse_occurred",
      "i_live_here",
    ],
    relationship_type: "spouse",
    children_together: true,
    have_child_together: true,
    divorce_pending: true,
    pending_divorce: true,
    divorce_petitioner: "i_filed",
    divorce_case_name: "Johnson v. Johnson",
    divorce_case_number: "2025-DR-009112",
    divorce_parish: "East Baton Rouge",
    custody_case_pending: true,
    pending_custody: true,
    custody_case_number: "2025-CU-004521",
    custody_parish: "East Baton Rouge",
    custody_order_exists: true,

    // LPOR-C trigger and core child/custody data from intake
    have_children: true,
    request_temporary_custody: true,
    request_temp_custody: true,
    children_current_location:
      "Petitioner and maternal grandmother, Elena Johnson",
    children_same_address: true,
    police_retrieve_children: true,
    need_police_retrieval: true,
    supervised_visitation: true,
    prevent_interference: true,
    number_of_children: 3,

    children: [
      {
        id: "child-1",
        name: "Avery Johnson",
        dateOfBirth: "2016-02-11",
        relationshipToPetitioner: "Child",
      },
      {
        id: "child-2",
        name: "Noah Johnson",
        dateOfBirth: "2018-09-03",
        relationshipToPetitioner: "Child",
      },
      {
        id: "child-3",
        name: "Mia Johnson",
        dateOfBirth: "2021-05-27",
        relationshipToPetitioner: "Child",
      },
    ],

    // Incompetent persons
    protecting_incompetent: true,
    incompetent_name: "Sam Johnson Sr.",
    incompetent_dob: "1961-10-07",
    incompetent_relationship: "Father-in-law",
    incompetent_persons: [
      {
        id: "inc-1",
        name: "Sam Johnson Sr.",
        dateOfBirth: "1961-10-07",
        relationshipToPetitioner: "Father-in-law",
      },
      {
        id: "inc-2",
        name: "Elena Johnson",
        dateOfBirth: "1949-01-14",
        relationshipToPetitioner: "Grandmother",
      },
    ],

    // Abuse and danger
    abuse_types: [
      "physical",
      "threats",
      "stalking",
      "emotional",
    ],
    abuse_description:
      "Respondent has repeatedly threatened petitioner, followed petitioner to work, and committed physical abuse.",
    choking_occurred: false,
    choking_strangulation: false,
    pregnancy_abuse: false,
    abuse_while_pregnant: false,
    abuse_increasing: true,
    abuse_severity: true,
    left_recently: true,
    suicide_threats: true,
    immediate_danger: true,

    // Incident detail
    recent_incident_date: "2026-02-20",
    recent_incident_description:
      "On February 20, the defendant arrived uninvited at petitioner's home, banged on doors, threatened to take the children, and sent threatening messages after leaving. He seemed to have been drinking, and broke several items in the house.",
    past_incidents:
      "Since November, the defendant has repeatedly appeared at petitioner's home and work, sent threatening messages, damaged household property, and followed petitioner in a vehicle. In December and January, defendant also shouted threats in front of the children and attempted to block petitioner from leaving the residence.",

    // Firearms
    abuser_has_guns: true,
    gun_threats: true,
    concealed_carry: true,
    number_of_guns: 3,
    gun_1_type: "Handgun",
    gun_1_details: "Black Glock 19, 9mm",
    gun_1_location: "Vehicle glovebox",
    firearms: [
      {
        type: "Handgun",
        location: "Vehicle glovebox",
        serial: "ABC12345",
      },
    ],

    // Relief / property / financial
    request_no_abuse: true,
    request_no_contact: true,
    request_stay_away: true,
    stay_away_home: true,
    home_address_for_order:
      "245 Harbor Lane, Apt 12C, Baton Rouge, LA 70808",
    stay_away_work: true,
    work_address:
      "900 Government St, Baton Rouge, LA 70802",
    stay_away_school: true,
    school_address:
      "1200 School Ave, Baton Rouge, LA 70810",
    relief_requested: [
      "no_abuse",
      "no_contact",
      "stay_away_home",
      "stay_away_work",
      "stay_away_school",
      "move_out",
      "exclusive_use_home",
      "surrender_firearms",
      "temporary_custody",
      "child_support",
      "spousal_support",
    ],
    relief_other:
      "Defendant shall not contact petitioner's employer or children's daycare.",
    protect_property: true,
    shared_residence: true,
    live_together: true,
    request_exclusive_use: true,
    need_exclusive_home: true,
    home_ownership:
      "The home is owned by both the petitioner and respondent. There are no other owners of the house or the property.",
    protect_belongings: true,
    police_escort: true,
    keep_pets: true,
    have_pets: true,
    pet_description:
      "Brown lab named Daisy. 3 cats named Whiskers, Shadow, and Mittens. 2 birds named Tweety and Sunny. Four fish in a tank named Bubbles, Fin, Goldie, and Splash. 5 horses named Star, Thunder, Bella, Duke, and Rosie.",
    pet_details:
      "Brown lab named Daisy. 3 cats named Whiskers, Shadow, and Mittens. 2 birds named Tweety and Sunny. Four fish in a tank named Bubbles, Fin, Goldie, and Splash. 5 horses named Star, Thunder, Bella, Duke, and Rosie.",
    request_child_support: true,
    request_spousal_support: true,
    request_medical_costs: true,
    require_counseling: true,
    require_evaluation: true,
    request_court_costs: true,
    want_permanent_order: true,
    request_criminal_history: true,

    // Service and witness info
    have_witnesses: true,
    witness_count: 2,
    number_of_witnesses: 2,
    need_witness_criminal_check: true,
    witness_1_name: "Taylor Smith",
    witness_1_dob: "1990-08-09",
    witnesses: [
      {
        id: "w-1",
        name: "Taylor Smith",
        dateOfBirth: "1990-08-09",
        relationshipToPetitioner: "Neighbor",
      },
      {
        id: "w-2",
        name: "Jordan Lee",
        dateOfBirth: "1984-12-11",
        relationshipToPetitioner: "Coworker",
      },
    ],
    service_address_type: "home",
    service_address:
      "4100 Oak Ridge Dr, Baton Rouge, LA 70809",

    // Accommodations / representation
    need_interpreter: true,
    interpreter_language: "Spanish",
    witness_interpreter: true,
    witness_language: "Vietnamese",
    disability_accommodations: false,
    have_attorney: true,
    attorney_name: "Avery M. Carter",
    attorney_bar_number: "LA-28491",
    debug_fill_all_fields: true,
  };

  const templatePath = resolve(
    process.cwd(),
    "public/templates/Lpor_C.pdf",
  );
  const templateBytes =
    readFileSync(templatePath);
  const pdfBytes = await generateLPORCPDF(
    testData,
    { templateBytes },
  );

  const outputDir = resolve(process.cwd(), "tmp");
  mkdirSync(outputDir, { recursive: true });
  const outputPath = resolve(
    outputDir,
    "LPOR-C_test_from_intake_flow.pdf",
  );
  writeFileSync(outputPath, pdfBytes);

  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
