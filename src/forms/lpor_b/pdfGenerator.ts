/**
 * Form B: Petition for Protection from Abuse (LPOR-B)
 *
 * Main petition form requesting court protection from domestic abuse.
 * This is the primary form required for all protection order requests.
 */

import type { MasterFormData } from "../../types/generated";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";
import {
  drawPageHeader,
  drawPageFooter,
  drawText,
  drawCheckbox,
  drawField,
  drawLine,
  formatDate,
  SIZES,
  COLORS,
} from "../../utils/pdfUtils";

export async function generateLPORBPDF(
  formData: MasterFormData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );
  const boldFont = await doc.embedFont(
    StandardFonts.HelveticaBold,
  );

  // Page 1: Petition Header and Petitioner Information
  const page1 = doc.addPage([
    SIZES.letterWidth,
    SIZES.letterHeight,
  ]);

  let y = drawPageHeader(
    page1,
    "PETITION FOR PROTECTION FROM ABUSE",
    "Louisiana Revised Statutes 46:2131 et seq.",
    font,
    boldFont,
  );

  y -= 10;

  // Filing Type
  drawCheckbox(page1, {
    x: SIZES.marginLeft,
    y,
    checked: formData.filing_type === "initial",
    label: "Initial Petition",
    font,
    fontSize: 10,
  });

  drawCheckbox(page1, {
    x: SIZES.marginLeft + 150,
    y,
    checked:
      formData.filing_type === "supplemental",
    label: "Supplemental Petition",
    font,
    fontSize: 10,
  });

  y -= 30;

  // Who Needs Protection
  page1.drawText(
    "Who needs protection? (Check all that apply)",
    {
      x: SIZES.marginLeft,
      y,
      size: 11,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 20;

  const protectionChecks =
    formData.who_needs_protection || [];

  drawCheckbox(page1, {
    x: SIZES.marginLeft + 20,
    y,
    checked: protectionChecks.includes("self"),
    label: "Myself",
    font,
    fontSize: 10,
  });

  drawCheckbox(page1, {
    x: SIZES.marginLeft + 150,
    y,
    checked:
      protectionChecks.includes("children"),
    label: "My minor children",
    font,
    fontSize: 10,
  });

  drawCheckbox(page1, {
    x: SIZES.marginLeft + 320,
    y,
    checked: protectionChecks.includes(
      "incompetent",
    ),
    label: "Incompetent person",
    font,
    fontSize: 10,
  });

  y -= 30;
  drawLine(
    page1,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Petitioner Information
  page1.drawText("PETITIONER INFORMATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page1,
    "Full Legal Name",
    formData.full_name || "",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  y = drawField(
    page1,
    "Date of Birth",
    formatDate(formData.birth_date),
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  drawCheckbox(page1, {
    x: SIZES.marginLeft,
    y,
    checked: formData.louisiana_resident === true,
    label: "I am a resident of Louisiana",
    font,
    fontSize: 10,
  });

  y -= 30;
  drawLine(
    page1,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Address Information
  page1.drawText("ADDRESS INFORMATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  drawCheckbox(page1, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.keep_address_private === true,
    label:
      "I want to keep my address confidential (complete Form F)",
    font,
    fontSize: 10,
  });

  y -= 25;

  if (!formData.keep_address_private) {
    const address = [
      formData.current_address_street,
      formData.current_address_apt
        ? `Apt ${formData.current_address_apt}`
        : "",
    ]
      .filter(Boolean)
      .join(", ");

    y = drawField(
      page1,
      "Street Address",
      address,
      SIZES.marginLeft,
      y,
      font,
      boldFont,
    );

    y -= 5;

    const cityStateZip = [
      formData.current_address_city,
      formData.current_address_state,
      formData.current_address_zip,
    ]
      .filter(Boolean)
      .join(", ");

    y = drawField(
      page1,
      "City, State, ZIP",
      cityStateZip,
      SIZES.marginLeft,
      y,
      font,
      boldFont,
    );
  }

  y -= 30;
  drawLine(
    page1,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Children Information
  if (
    formData.have_children &&
    formData.children &&
    formData.children.length > 0
  ) {
    page1.drawText(
      "MINOR CHILDREN NEEDING PROTECTION",
      {
        x: SIZES.marginLeft,
        y,
        size: 12,
        font: boldFont,
        color: COLORS.black,
      },
    );

    y -= 25;

    for (const child of formData.children.slice(
      0,
      3,
    )) {
      y = drawField(
        page1,
        "Child Name",
        child.name,
        SIZES.marginLeft,
        y,
        font,
        boldFont,
        9,
        10,
      );

      page1.drawText(
        `DOB: ${formatDate(child.dateOfBirth)} | Relationship: ${child.relationshipToPetitioner}`,
        {
          x: SIZES.marginLeft + 20,
          y: y + 5,
          size: 9,
          font,
          color: COLORS.gray,
        },
      );

      y -= 20;
    }

    if (formData.children.length > 3) {
      page1.drawText(
        `... and ${formData.children.length - 3} more children (see attachment)`,
        {
          x: SIZES.marginLeft,
          y,
          size: 9,
          font,
          color: COLORS.gray,
        },
      );
      y -= 15;
    }
  }

  // Page footer
  drawPageFooter(page1, 1, 2, font);

  // Page 2: Defendant and Abuse Details
  const page2 = doc.addPage([
    SIZES.letterWidth,
    SIZES.letterHeight,
  ]);

  y = drawPageHeader(
    page2,
    "PETITION FOR PROTECTION FROM ABUSE (continued)",
    "Page 2",
    font,
    boldFont,
  );

  // Defendant Information
  page2.drawText("DEFENDANT INFORMATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page2,
    "Name of Person You Need Protection From",
    formData.abuser_name || "",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 5;

  if (formData.abuser_is_minor) {
    page2.drawText("⚠ Defendant is a minor", {
      x: SIZES.marginLeft,
      y,
      size: 9,
      font: boldFont,
      color: rgb(0.8, 0.4, 0),
    });
    y -= 15;

    y = drawField(
      page2,
      "Parent/Guardian Name",
      formData.parent_guardian_name || "",
      SIZES.marginLeft,
      y,
      font,
      boldFont,
    );
  }

  y -= 30;
  drawLine(
    page2,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Relationship to Defendant
  page2.drawText("RELATIONSHIP TO DEFENDANT", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page2,
    "How are you related to this person?",
    formData.relationship_type || "",
    SIZES.marginLeft,
    y,
    font,
    boldFont,
  );

  y -= 30;
  drawLine(
    page2,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Abuse Details
  page2.drawText("ABUSE DESCRIPTION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  const abuseTypes = formData.abuse_types || [];

  page2.drawText(
    "Types of abuse: " +
      (abuseTypes.length > 0
        ? abuseTypes.join(", ")
        : "Not specified"),
    {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
      maxWidth:
        SIZES.marginRight - SIZES.marginLeft,
    },
  );

  y -= 30;

  if (formData.abuse_description) {
    y = drawText(
      page2,
      formData.abuse_description,
      {
        x: SIZES.marginLeft,
        y,
        size: 10,
        font,
        maxWidth:
          SIZES.marginRight - SIZES.marginLeft,
      },
    );
  }

  y -= 30;
  drawLine(
    page2,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Relief Requested
  page2.drawText("RELIEF REQUESTED", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  drawCheckbox(page2, {
    x: SIZES.marginLeft,
    y,
    checked: formData.request_no_abuse === true,
    label: "Order defendant to stop abuse",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page2, {
    x: SIZES.marginLeft,
    y,
    checked: formData.request_no_contact === true,
    label:
      "Order defendant to have no contact with me",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page2, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.request_temp_custody === true,
    label:
      "Grant me temporary custody of minor children",
    font,
    fontSize: 10,
  });

  // Page footer
  drawPageFooter(page2, 2, 2, font);

  return await doc.save();
}
