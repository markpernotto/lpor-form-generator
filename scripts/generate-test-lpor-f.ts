import {
  writeFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { generateLPORFPDF } from "../src/forms/lpor_f/pdfGenerator.ts";
import type { LPORFFormData } from "../src/forms/lpor_f/formTypes.ts";

async function main() {
  const testData: LPORFFormData = {
    filingPurpose: {
      forPetitioner: true,
      forMinorChildren: true,
      forAllegedIncompetent: true,
    },
    petitioner: {
      firstName: "Jane",
      maidenMiddleName: "Marie",
      lastName: "Doe",
      dateOfBirth: "1988-06-24",
      race: "White",
      address: {
        street: "123 Safety Way",
        aptNumber: "4B",
        city: "Baton Rouge",
        state: "LA",
        zipCode: "70802",
      },
      socialSecurityNumber: "XXX-XX-4321",
      driversLicense: "LA-DL-1029384",
      phoneNumber: "225-555-0128",
      email: "jane.doe@example.org",
    },
    minorChildren: [
      {
        id: "child-1",
        name: "Alex Doe",
        dateOfBirth: "2015-03-12",
        relationshipToPetitioner: "Child",
      },
      {
        id: "child-2",
        name: "Taylor Doe",
        dateOfBirth: "2018-11-02",
        relationshipToPetitioner: "Child",
      },
      {
        id: "child-3",
        name: "Jordan Doe",
        dateOfBirth: "2020-07-19",
        relationshipToPetitioner: "Child",
      },
      {
        id: "child-4",
        name: "Riley Doe",
        dateOfBirth: "2023-01-05",
        relationshipToPetitioner: "Child",
      },
    ],
    allegedIncompetent: [
      {
        id: "inc-1",
        name: "Pat Doe",
        dateOfBirth: "1954-03-22",
        relationshipToPetitioner:
          "Grandparent",
      },
    ],
    sameAddressForAll: true,
    minorChildrenAddress: {
      street: "123 Safety Way",
      aptNumber: "4B",
      city: "Baton Rouge",
      state: "LA",
      zipCode: "70802",
    },
    defendant: {
      fullName: "John Q Doe",
      parentGuardianName: "Robert Doe",
      alias: "Johnny",
      race: "White",
      address: {
        street: "77 Main St",
        aptNumber: "2A",
        city: "Baton Rouge",
        state: "LA",
        zipCode: "70801",
      },
      socialSecurityNumber: "XXX-XX-8765",
      driversLicense: "LA-DL-6677889",
      phoneNumber: "225-555-0991",
      email: "john.doe@example.net",
    },
  };
  const templatePath = resolve(
    process.cwd(),
    "public/templates/Lpor_F.pdf",
  );
  const templateBytes = readFileSync(templatePath);
  const pdfBytes = await generateLPORFPDF(
    testData,
    { templateBytes },
  );

  const outputDir = resolve(process.cwd(), "tmp");
  mkdirSync(outputDir, { recursive: true });
  const outputPath = resolve(outputDir, "LPOR-F_test_from_intake_flow.pdf");
  writeFileSync(outputPath, pdfBytes);

  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
