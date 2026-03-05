/**
 * Form G: Firearms Information and Declaration of Non-Possession (LPOR-G)
 *
 * Uses the official LPOR-G template when available and overlays
 * only intake fields that map to this firearms declaration form.
 */

import type { MasterFormData } from "../../types/generated";
import {
  PDFDocument,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
} from "pdf-lib";

function textOrEmpty(
  value: string | undefined,
): string {
  return (value ?? "").trim();
}

function drawFieldText(
  page: PDFPage,
  font: PDFFont,
  value: string | undefined,
  x: number,
  y: number,
  size: number = 10,
): void {
  const text = textOrEmpty(value);
  if (!text) return;

  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawCheckmark(
  page: PDFPage,
  font: PDFFont,
  checked: boolean,
  x: number,
  y: number,
): void {
  if (!checked) return;

  page.drawText("X", {
    x,
    y,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
}

type FirearmRow = {
  manufacturerModelCaliber?: string;
  type?: string;
  location?: string;
};

function getFirearmRows(
  formData: MasterFormData,
): FirearmRow[] {
  const rows: FirearmRow[] = [];

  for (const firearm of formData.firearms ?? []) {
    rows.push({
      manufacturerModelCaliber: textOrEmpty(
        firearm.serial,
      ),
      type: textOrEmpty(firearm.type),
      location: textOrEmpty(firearm.location),
    });
  }

  if (
    rows.length === 0 &&
    (textOrEmpty(formData.gun_1_type) ||
      textOrEmpty(formData.gun_1_details) ||
      textOrEmpty(formData.gun_1_location))
  ) {
    rows.push({
      manufacturerModelCaliber: textOrEmpty(
        formData.gun_1_details,
      ),
      type: textOrEmpty(formData.gun_1_type),
      location: textOrEmpty(formData.gun_1_location),
    });
  }

  return rows.slice(0, 2);
}

function drawLPORGTemplateOverlay(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const defendantName =
    textOrEmpty(formData.abuser_name) ||
    textOrEmpty(formData.petitioner_full_name) ||
    textOrEmpty(formData.full_name);

  const hasGuns = formData.abuser_has_guns === true;
  const concealedCarry = formData.concealed_carry;

  // Top CIVIL/CRIMINAL case boxes are intentionally left blank unless
  // intake captures explicit fields for those exact boxes.

  // Defendant/Defendant-in-reconvention name line.
  drawFieldText(
    page,
    font,
    defendantName,
    245,
    589,
    12,
  );

  // Firearms possession checkboxes.
  drawCheckmark(
    page,
    font,
    !hasGuns,
    45,
    440,
  );
  drawCheckmark(
    page,
    font,
    hasGuns,
    45,
    301,
  );

  // Concealed handgun permit checkboxes.
  drawCheckmark(
    page,
    font,
    concealedCarry === false,
    367,
    440,
  );
  drawCheckmark(
    page,
    font,
    concealedCarry === true,
    367,
    359,
  );

  // Firearms table rows.
  const rows = getFirearmRows(formData);
  const rowY = [254, 199];

  rows.forEach((row, index) => {
    const y = rowY[index];
    if (y === undefined) return;

    drawFieldText(
      page,
      font,
      row.manufacturerModelCaliber,
      56,
      y,
      10,
    );
    drawFieldText(
      page,
      font,
      row.type,
      244,
      y,
      10,
    );
    drawFieldText(
      page,
      font,
      row.location,
      355,
      y,
      10,
    );
  });
}

async function generateTemplateBasedLPORG(
  formData: MasterFormData,
  templateBytes?: ArrayBuffer | Uint8Array,
): Promise<Uint8Array> {
  const doc = templateBytes
    ? await PDFDocument.load(templateBytes)
    : await (async () => {
        const templateResponse = await fetch(
          "/templates/Lpor_G.pdf",
          { cache: "no-store" },
        );
        if (!templateResponse.ok) {
          throw new Error(
            `Template load failed: ${templateResponse.status}`,
          );
        }
        const bytes =
          await templateResponse.arrayBuffer();
        return await PDFDocument.load(bytes);
      })();

  const page = doc.getPages()[0];
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );

  drawLPORGTemplateOverlay(page, font, formData);

  return await doc.save();
}

async function generateFallbackLPORG(
  formData: MasterFormData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 1008]);
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );
  const boldFont = await doc.embedFont(
    StandardFonts.HelveticaBold,
  );

  page.drawText("LPOR-G TEMPLATE NOT AVAILABLE", {
    x: 145,
    y: 930,
    size: 20,
    font: boldFont,
    color: rgb(0.8, 0, 0),
  });

  page.drawText(
    "Firearms declaration data (summary):",
    {
      x: 50,
      y: 892,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );

  page.drawText(
    `Defendant: ${textOrEmpty(formData.abuser_name) || "(not provided)"}`,
    {
      x: 50,
      y: 868,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    },
  );

  page.drawText(
    `Has firearms: ${formData.abuser_has_guns === true ? "Yes" : formData.abuser_has_guns === false ? "No" : "Unknown"}`,
    {
      x: 50,
      y: 846,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    },
  );

  page.drawText(
    `Concealed permit: ${formData.concealed_carry === true ? "Yes" : formData.concealed_carry === false ? "No" : "Unknown"}`,
    {
      x: 50,
      y: 824,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    },
  );

  return await doc.save();
}

export async function generateLPORGPDF(
  formData: MasterFormData,
  options?: {
    templateBytes?: ArrayBuffer | Uint8Array;
  },
): Promise<Uint8Array> {
  try {
    return await generateTemplateBasedLPORG(
      formData,
      options?.templateBytes,
    );
  } catch {
    return await generateFallbackLPORG(formData);
  }
}
