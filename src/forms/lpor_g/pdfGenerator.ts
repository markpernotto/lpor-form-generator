/**
 * Form G: Request for Temporary Restraining Order (LPOR-G)
 *
 * Request for immediate temporary restraining order before hearing.
 * Provides emergency protection until full hearing can be scheduled.
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
  drawLine,
  SIZES,
  COLORS,
} from "../../utils/pdfUtils";

export async function generateLPORGPDF(
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
    "REQUEST FOR TEMPORARY RESTRAINING ORDER",
    "Emergency Protection Order - Louisiana R.S. 46:2135",
    font,
    boldFont,
  );

  // Emergency Nature
  const emergencyBox = {
    x: SIZES.marginLeft - 10,
    y: y - 5,
    width:
      SIZES.marginRight - SIZES.marginLeft + 20,
    height: 60,
  };

  page.drawRectangle({
    ...emergencyBox,
    borderColor: COLORS.black,
    borderWidth: 2,
  });

  y -= 20;

  page.drawText("[EMERGENCY] EMERGENCY REQUEST", {
    x: SIZES.marginLeft,
    y,
    size: 14,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 20;

  page.drawText(
    "Petitioner requests immediate protection before full court hearing",
    {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
    },
  );

  y -= 40;

  // Parties
  page.drawText(
    "PETITIONER (Person seeking protection):",
    {
      x: SIZES.marginLeft,
      y,
      size: 11,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 20;

  page.drawText(
    formData.petitioner_full_name ||
      formData.full_name ||
      "(Not provided)",
    {
      x: SIZES.marginLeft + 20,
      y,
      size: 11,
      font,
      color: COLORS.black,
    },
  );

  y -= 25;

  page.drawText(
    "DEFENDANT (Person to be restrained):",
    {
      x: SIZES.marginLeft,
      y,
      size: 11,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 20;

  page.drawText(
    formData.abuser_name || "(Not provided)",
    {
      x: SIZES.marginLeft + 20,
      y,
      size: 11,
      font,
      color: COLORS.black,
    },
  );

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Immediate Danger
  page.drawText("IMMEDIATE DANGER EXISTS", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.immediate_danger === true,
    label: "I am in immediate danger of abuse",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.abuse_increasing === true,
    label: "The abuse is getting worse",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.gun_threats === true ||
      formData.abuser_has_guns === true,
    label:
      "Defendant has threatened me with weapons",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.suicide_threats === true,
    label:
      "Defendant has threatened suicide or homicide",
    font,
    fontSize: 10,
  });

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Restraints Requested
  page.drawText("RESTRAINTS REQUESTED", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.request_no_abuse === true,
    label:
      "Order defendant to stop all abuse immediately",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.request_no_contact === true,
    label:
      "Order defendant to have no contact with me (in person, phone, text, email, social media)",
    font,
    fontSize: 10,
  });

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.request_stay_away === true,
    label: "Order defendant to stay away from:",
    font,
    fontSize: 10,
  });

  y -= 20;

  if (formData.stay_away_home) {
    page.drawText(
      `    • My home: ${formData.home_address_for_order || "(address confidential)"}`,
      {
        x: SIZES.marginLeft + 20,
        y,
        size: 9,
        font,
        color: COLORS.black,
      },
    );
    y -= 15;
  }

  if (formData.stay_away_work) {
    page.drawText(
      `    • My workplace: ${formData.work_address || "(not specified)"}`,
      {
        x: SIZES.marginLeft + 20,
        y,
        size: 9,
        font,
        color: COLORS.black,
      },
    );
    y -= 15;
  }

  if (formData.stay_away_school) {
    page.drawText(
      `    • My school: ${formData.school_address || "(not specified)"}`,
      {
        x: SIZES.marginLeft + 20,
        y,
        size: 9,
        font,
        color: COLORS.black,
      },
    );
    y -= 15;
  }

  y -= 10;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.request_exclusive_use === true,
    label:
      "Order defendant to leave our shared residence immediately",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked: formData.abuser_has_guns === true,
    label:
      "Order defendant to surrender all firearms",
    font,
    fontSize: 10,
  });

  y -= 30;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Why Immediate Order is Necessary
  page.drawText(
    "WHY IMMEDIATE ORDER IS NECESSARY",
    {
      x: SIZES.marginLeft,
      y,
      size: 12,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 25;

  const urgency =
    "I need this temporary restraining order immediately because I am in danger and " +
    "cannot wait for a full hearing. Without immediate court protection, I believe the " +
    "defendant will continue to harm me or my children.";

  y = drawText(page, urgency, {
    x: SIZES.marginLeft,
    y,
    size: 10,
    font,
    maxWidth:
      SIZES.marginRight - SIZES.marginLeft,
  });

  y -= 30;

  // Duration Notice
  page.drawText("NOTICE", {
    x: SIZES.marginLeft,
    y,
    size: 11,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 20;

  const notice =
    "This temporary restraining order will remain in effect until a full hearing is held, " +
    "typically within 21 days. Both parties will be notified of the hearing date.";

  y = drawText(page, notice, {
    x: SIZES.marginLeft,
    y,
    size: 9,
    font,
    maxWidth:
      SIZES.marginRight - SIZES.marginLeft,
  });

  y -= 30;

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
