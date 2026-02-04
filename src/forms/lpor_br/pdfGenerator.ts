/**
 * Form B-R: Request for Rule to Show Cause (LPOR-B-R)
 *
 * Request to hold defendant in contempt for violating existing protection order.
 * Used in supplemental filings when defendant has violated court orders.
 */

import type { MasterFormData } from "../../types/generated";
import {
  PDFDocument,
  StandardFonts,
} from "pdf-lib";
import {
  drawPageHeader,
  drawPageFooter,
  drawText,
  drawCheckbox,
  drawField,
  drawLine,
  SIZES,
  COLORS,
} from "../../utils/pdfUtils";

export async function generateLPORBRPDF(
  formData: MasterFormData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );
  const boldFont = await doc.embedFont(
    StandardFonts.HelveticaBold,
  );

  const page = doc.addPage([
    SIZES.letterWidth,
    SIZES.letterHeight,
  ]);

  let y = drawPageHeader(
    page,
    "REQUEST FOR RULE TO SHOW CAUSE",
    "Contempt for Violation of Protection Order",
    font,
    boldFont,
  );

  // Warning Box
  const warningBox = {
    x: SIZES.marginLeft - 10,
    y: y - 5,
    width:
      SIZES.marginRight - SIZES.marginLeft + 20,
    height: 75,
  };

  page.drawRectangle({
    ...warningBox,
    borderColor: COLORS.black,
    borderWidth: 2,
  });

  y -= 20;

  page.drawText("⚠ VIOLATION OF COURT ORDER", {
    x: SIZES.marginLeft,
    y,
    size: 14,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 20;

  page.drawText(
    "Use this form to report that the defendant has violated the",
    {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
    },
  );

  y -= 15;

  page.drawText(
    "existing protection order. The court may hold them in contempt.",
    {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
    },
  );

  y -= 35;

  // Existing Case Information
  page.drawText("EXISTING PROTECTION ORDER", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page,
    "Case Number",
    formData.divorce_case_number ||
      formData.custody_case_number ||
      "(Not provided)",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  y = drawField(
    page,
    "Parish",
    formData.filing_parish ||
      formData.divorce_parish ||
      "(Not provided)",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  y = drawField(
    page,
    "Original Order Date",
    formData.signature_date || "(Not provided)",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Parties
  page.drawText("PARTIES", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page,
    "Protected Person (Petitioner)",
    formData.petitioner_full_name ||
      formData.full_name ||
      "",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  y = drawField(
    page,
    "Defendant (Person violating order)",
    formData.abuser_name || "",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Violations
  page.drawText("VIOLATIONS COMMITTED", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  page.drawText(
    "The defendant violated the protection order by:",
    {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
    },
  );

  y -= 25;

  const violations = [
    "Contacting me in violation of no-contact order",
    "Coming to my home/work/school in violation of stay-away order",
    "Threatening or harassing me",
    "Refusing to surrender firearms as ordered",
    "Interfering with child custody arrangements",
    "Other violations of the court order",
  ];

  for (const violation of violations) {
    drawCheckbox(page, {
      x: SIZES.marginLeft + 10,
      y,
      checked: false,
      label: violation,
      font,
      fontSize: 9,
    });
    y -= 18;
  }

  y -= 15;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Violation Details
  page.drawText("DETAILS OF VIOLATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page,
    "Date of Most Recent Violation",
    formData.recent_incident_date ||
      "(Not provided)",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 10;

  page.drawText("Description of what happened:", {
    x: SIZES.marginLeft,
    y,
    size: 10,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 20;

  const description =
    formData.recent_incident_description ||
    "Describe in detail how the defendant violated the protection order, including dates, times, " +
      "locations, and any witnesses.";

  y = drawText(page, description, {
    x: SIZES.marginLeft,
    y,
    size: 9,
    font,
    maxWidth:
      SIZES.marginRight - SIZES.marginLeft,
  });

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: false,
    label:
      "Police were called (attach police report if available)",
    font,
    fontSize: 9,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: false,
    label:
      "I have evidence of the violation (photos, texts, emails, voicemails, witnesses)",
    font,
    fontSize: 9,
  });

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Relief Requested
  page.drawText("RELIEF REQUESTED", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  page.drawText("I request that the court:", {
    x: SIZES.marginLeft,
    y,
    size: 10,
    font,
    color: COLORS.black,
  });

  y -= 20;

  const reliefs = [
    "Find the defendant in contempt of court",
    "Order defendant to jail for violating the protection order",
    "Impose fines or other penalties",
    "Strengthen the protection order",
    "Extend the duration of the protection order",
  ];

  for (const relief of reliefs) {
    drawCheckbox(page, {
      x: SIZES.marginLeft + 10,
      y,
      checked: true,
      label: relief,
      font,
      fontSize: 9,
    });
    y -= 18;
  }

  y -= 25;

  // Signature
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginLeft + 200,
  );
  page.drawText("Petitioner Signature", {
    x: SIZES.marginLeft,
    y: y - 15,
    size: 9,
    font,
    color: COLORS.gray,
  });

  drawLine(
    page,
    SIZES.marginLeft + 250,
    y,
    SIZES.marginRight,
  );
  page.drawText("Date", {
    x: SIZES.marginLeft + 250,
    y: y - 15,
    size: 9,
    font,
    color: COLORS.gray,
  });

  // Page footer
  drawPageFooter(page, 1, 1, font);

  return await doc.save();
}
