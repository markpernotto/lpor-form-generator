import {
  writeFileSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { generateLPORGPDF } from "../src/forms/lpor_g/pdfGenerator.ts";
import type { MasterFormData } from "../src/types/generated.ts";

async function main() {
  const testData: MasterFormData = {
    abuser_name: "Derek Johnson",
    abuser_has_guns: true,
    concealed_carry: true,
    firearms: [
      {
        type: "Handgun",
        location: "Vehicle glovebox",
        serial: "Glock 19 / 9mm",
      },
      {
        type: "Rifle",
        location: "Bedroom closet",
        serial: "Ruger AR-556 / .223",
      },
    ],
  };

  const templatePath = resolve(
    process.cwd(),
    "public/templates/Lpor_G.pdf",
  );
  const templateBytes =
    readFileSync(templatePath);

  const pdfBytes = await generateLPORGPDF(
    testData,
    { templateBytes },
  );

  const outputDir = resolve(process.cwd(), "tmp");
  mkdirSync(outputDir, { recursive: true });

  const outputPath = resolve(
    outputDir,
    "LPOR-G_test_from_intake_flow.pdf",
  );
  writeFileSync(outputPath, pdfBytes);

  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
