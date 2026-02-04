/**
 * Form C: Request for Child Custody (LPOR-C)
 *
 * Request for temporary custody of minor children in domestic violence cases.
 * Filed when petitioner needs immediate custody arrangements for protection.
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
  formatDate,
  SIZES,
  COLORS,
} from "../../utils/pdfUtils";

export async function generateLPORCPDF(
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
    "REQUEST FOR CHILD CUSTODY",
    "Temporary Custody in Domestic Violence Protection Order",
    font,
    boldFont,
  );

  // Petitioner Information
  page.drawText("PETITIONER", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  y = drawField(
    page,
    "Name",
    formData.petitioner_full_name ||
      formData.full_name ||
      "",
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

  // Children Information
  page.drawText(
    "CHILDREN FOR WHOM CUSTODY IS REQUESTED",
    {
      x: SIZES.marginLeft,
      y,
      size: 12,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 25;

  if (
    formData.children &&
    formData.children.length > 0
  ) {
    for (
      let i = 0;
      i < formData.children.length;
      i++
    ) {
      const child = formData.children[i];

      page.drawText(`Child ${i + 1}:`, {
        x: SIZES.marginLeft,
        y,
        size: 10,
        font: boldFont,
        color: COLORS.black,
      });

      y -= 18;

      y = drawField(
        page,
        "Name",
        child.name,
        SIZES.marginLeft + 20,
        y,
        font,
        boldFont,
        9,
        10,
      );

      y -= 5;

      y = drawField(
        page,
        "Date of Birth",
        formatDate(child.dateOfBirth),
        SIZES.marginLeft + 20,
        y,
        font,
        boldFont,
        9,
        10,
      );

      y -= 5;

      y = drawField(
        page,
        "Relationship",
        child.relationshipToPetitioner,
        SIZES.marginLeft + 20,
        y,
        font,
        boldFont,
        9,
        10,
      );

      y -= 20;

      if (y < 150) {
        page.drawText(
          "(continued on additional pages)",
          {
            x: SIZES.marginLeft,
            y: y - 10,
            size: 9,
            font,
            color: COLORS.gray,
          },
        );
        break;
      }
    }
  } else {
    page.drawText(
      "No children information provided",
      {
        x: SIZES.marginLeft,
        y,
        size: 10,
        font,
        color: COLORS.gray,
      },
    );
    y -= 20;
  }

  y -= 20;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Current Custody Situation
  page.drawText("CURRENT SITUATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  if (formData.children_current_location) {
    y = drawField(
      page,
      "Where are the children now?",
      formData.children_current_location,
      SIZES.marginLeft,
      y,
      font,
      boldFont,
    );

    y -= 10;
  }

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.children_same_address === true,
    label: "Children currently live with me",
    font,
    fontSize: 10,
  });

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.police_retrieve_children === true,
    label:
      "Police assistance needed to retrieve children",
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

  // Custody Requests
  page.drawText(
    "CUSTODY ARRANGEMENTS REQUESTED",
    {
      x: SIZES.marginLeft,
      y,
      size: 12,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 25;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.request_temp_custody === true,
    label:
      "Grant me temporary sole custody of the children",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.supervised_visitation === true,
    label:
      "Require supervised visitation for defendant",
    font,
    fontSize: 10,
  });

  y -= 20;

  drawCheckbox(page, {
    x: SIZES.marginLeft,
    y,
    checked:
      formData.prevent_interference === true,
    label:
      "Prohibit defendant from interfering with my custody",
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

  // Why Custody is Necessary
  page.drawText(
    "REASON CUSTODY ORDER IS NEEDED",
    {
      x: SIZES.marginLeft,
      y,
      size: 12,
      font: boldFont,
      color: COLORS.black,
    },
  );

  y -= 25;

  const reasons = [
    "The children need protection from the defendant",
    "Defendant poses a danger to the children",
    "Immediate custody arrangement necessary for children's safety",
  ];

  for (const reason of reasons) {
    page.drawText(`• ${reason}`, {
      x: SIZES.marginLeft + 10,
      y,
      size: 10,
      font,
      color: COLORS.black,
    });
    y -= 18;
  }

  y -= 20;
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  // Declaration
  page.drawText("DECLARATION", {
    x: SIZES.marginLeft,
    y,
    size: 12,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 25;

  const declaration =
    "I declare under penalty of perjury that the information provided in this " +
    "request is true and correct to the best of my knowledge. I understand that " +
    "this is a temporary custody arrangement and does not affect permanent custody rights.";

  y = drawText(page, declaration, {
    x: SIZES.marginLeft,
    y,
    size: 10,
    font,
    maxWidth:
      SIZES.marginRight - SIZES.marginLeft,
  });

  y -= 30;

  // Signature line
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
