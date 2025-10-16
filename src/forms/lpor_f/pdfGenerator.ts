import type { LPORFFormData } from "./formTypes";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

export async function generateLPORFPDF(
  formData: LPORFFormData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // Letter size
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );
  const boldFont = await doc.embedFont(
    StandardFonts.HelveticaBold,
  );

  let y = 750;

  // Title
  page.drawText("CONFIDENTIAL ADDRESS FORM", {
    x: 200,
    y: 640,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "TO BE USED WHEN PETITIONER DOES NOT WANT DEFENDANT",
    {
      x: 130,
      y: 620,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("TO LEARN ADDRESS", {
    x: 250,
    y: 605,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "PETITION FOR PROTECTION FROM ABUSE",
    {
      x: 210,
      y: 585,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );

  // Court info
  page.drawText(`${formData.courtName ?? ""}`, {
    x: 360,
    y: 752,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("COURT", {
    x: 550,
    y: 750,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 360, y: 750 },
    end: { x: 545, y: 750 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  page.drawText("PARISH/CITY OF", {
    x: 360,
    y: 735,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${formData.parishCity ?? ""}`, {
    x: 450,
    y: 737,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 445, y: 735 },
    end: { x: 585, y: 735 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("STATE OF LOUISIANA", {
    x: 360,
    y: 720,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("DIVISION", {
    x: 360,
    y: 705,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${formData.division ?? ""}`, {
    x: 415,
    y: 707,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 410, y: 705 },
    end: { x: 460, y: 705 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("NUMBER", {
    x: 470,
    y: 705,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    `${formData.docketNumber ?? ""}`,
    {
      x: 530,
      y: 707,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 525, y: 705 },
    end: { x: 585, y: 705 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("FILED", {
    x: 360,
    y: 690,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${formData.filedDate ?? ""}`, {
    x: 400,
    y: 692,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 395, y: 690 },
    end: { x: 480, y: 690 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("CLERK", {
    x: 490,
    y: 690,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(`${formData.clerk ?? ""}`, {
    x: 540,
    y: 692,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 535, y: 690 },
    end: { x: 585, y: 690 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  // Case caption
  const petitionerName =
    `${formData.petitioner.firstName} ${formData.petitioner.maidenMiddleName} ${formData.petitioner.lastName}`.trim();
  page.drawText(petitionerName, {
    x: 50,
    y: 752,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 50, y: 750 },
    end: { x: 280, y: 750 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  page.drawText("PETITIONER", {
    x: 50,
    y: 740,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("V.", {
    x: 160,
    y: 730,
    size: 12,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText(formData.defendant.fullName, {
    x: 50,
    y: 717,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 50, y: 715 },
    end: { x: 280, y: 715 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("DEFENDANT", {
    x: 50,
    y: 705,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.defendant.parentGuardianName ?? "",
    {
      x: 50,
      y: 692,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 50, y: 690 },
    end: { x: 280, y: 690 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "Parent/Guardian name if defendant is a minor",
    {
      x: 50,
      y: 680,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );

  y -= 240;

  // Main content
  page.drawText("The petition of", {
    x: 50,
    y: 555,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(petitionerName, {
    x: 120,
    y: 557,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("your name", {
    x: 180,
    y: 547,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 120, y: 555 },
    end: { x: 325, y: 555 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(", born", {
    x: 325,
    y: 555,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner.dateOfBirth
      ? formData.petitioner.dateOfBirth
      : "",
    {
      x: 365,
      y: 557,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("your date of birth", {
    x: 380,
    y: 547,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 355, y: 555 },
    end: { x: 465, y: 555 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  page.drawText(", a resident of the ", {
    x: 465,
    y: 555,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("State of ", {
    x: 50,
    y: 525,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.defendant.address.state,
    {
      x: 100,
      y: 527,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 90, y: 525 },
    end: { x: 180, y: 525 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(", respectfully represents:", {
    x: 180,
    y: 525,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Paragraph 1", {
    x: 260,
    y: 490,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(
    "Petitioner files this petition on behalf of:",
    {
      x: 50,
      y: 470,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("a. ", {
    x: 50,
    y: 450,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose.forPetitioner
      ? "x"
      : "",
    {
      x: 70,
      y: 452,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 450 },
    end: { x: 90, y: 450 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Petitioner, and/or", {
    x: 100,
    y: 450,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("b. ", {
    x: 50,
    y: 430,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose.forMinorChildren
      ? "x"
      : "",
    {
      x: 70,
      y: 432,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 430 },
    end: { x: 90, y: 430 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "Minor child(ren) as follows: (Name, Date of Birth, Relationship to Petitioner) ",
    {
      x: 100,
      y: 430,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 70, y: 410 },
    end: { x: 250, y: 410 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 410 },
    end: { x: 360, y: 410 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 410 },
    end: { x: 580, y: 410 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 390 },
    end: { x: 250, y: 390 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 390 },
    end: { x: 360, y: 390 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 390 },
    end: { x: 580, y: 390 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 370 },
    end: { x: 250, y: 370 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 370 },
    end: { x: 360, y: 370 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 370 },
    end: { x: 580, y: 370 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 350 },
    end: { x: 250, y: 350 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 350 },
    end: { x: 360, y: 350 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 350 },
    end: { x: 580, y: 350 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 330 },
    end: { x: 250, y: 330 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 330 },
    end: { x: 360, y: 330 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 330 },
    end: { x: 580, y: 330 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 310 },
    end: { x: 250, y: 310 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 310 },
    end: { x: 360, y: 310 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 310 },
    end: { x: 580, y: 310 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  formData.minorChildren.forEach(
    (child, index) => {
      if (index >= 6) return; // Limit to 6 entries for space
      const entryY = 410 - index * 20 + 2;
      page.drawText(child.name, {
        x: 70,
        y: entryY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(child.dateOfBirth ?? "", {
        x: 270,
        y: entryY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(
        child.relationshipToPetitioner,
        {
          x: 380,
          y: entryY,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        },
      );
    },
  );

  page.drawText("c. ", {
    x: 50,
    y: 290,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose.forAllegedIncompetent
      ? "x"
      : "",
    {
      x: 70,
      y: 292,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 290 },
    end: { x: 90, y: 290 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "Alleged incompetent as follows: (Name, Date of Birth, Relationship to Petitioner) ",
    {
      x: 100,
      y: 290,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 70, y: 270 },
    end: { x: 250, y: 270 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 270 },
    end: { x: 360, y: 270 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 270 },
    end: { x: 580, y: 270 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 250 },
    end: { x: 250, y: 250 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 250 },
    end: { x: 360, y: 250 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 250 },
    end: { x: 580, y: 250 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  formData.allegedIncompetent.forEach(
    (child, index) => {
      if (index >= 1) return; // Limit to 2 entries for space
      const entryY = 270 - index * 20 + 2;
      page.drawText(child.name, {
        x: 70,
        y: entryY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(child.dateOfBirth ?? "", {
        x: 270,
        y: entryY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      page.drawText(
        child.relationshipToPetitioner,
        {
          x: 380,
          y: entryY,
          size: 10,
          font: font,
          color: rgb(0, 0, 0),
        },
      );
    },
  );

  page.drawText("Paragraph 2", {
    x: 260,
    y: 220,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Petitioner's current address:", {
    x: 50,
    y: 200,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 100, y: 180 },
    end: { x: 580, y: 180 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner.address.street,
    {
      x: 100,
      y: 182,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("No. & Street", {
    x: 100,
    y: 170,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Apt. No.", {
    x: 300,
    y: 170,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner.address.aptNumber ?? "",
    {
      x: 300,
      y: 182,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 150 },
    end: { x: 580, y: 150 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner.address.city,
    {
      x: 100,
      y: 152,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.petitioner.address.state,
    {
      x: 300,
      y: 152,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.petitioner.address.zipCode,
    {
      x: 500,
      y: 152,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("City", {
    x: 100,
    y: 140,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("State", {
    x: 300,
    y: 140,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Zip Code", {
    x: 500,
    y: 140,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText(
    "The minor child(ren)'s or incompetent's current address:",
    {
      x: 50,
      y: 110,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 90 },
    end: { x: 580, y: 90 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.street ?? "",
    {
      x: 100,
      y: 92,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("No. & Street", {
    x: 100,
    y: 80,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Apt. No.", {
    x: 300,
    y: 80,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.aptNumber ??
      "",
    {
      x: 300,
      y: 92,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 60 },
    end: { x: 580, y: 60 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.city ?? "",
    {
      x: 100,
      y: 62,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.minorChildrenAddress?.state ?? "",
    {
      x: 300,
      y: 62,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.minorChildrenAddress?.zipCode ?? "",
    {
      x: 500,
      y: 62,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("City", {
    x: 100,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("State", {
    x: 300,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Zip Code", {
    x: 500,
    y: 50,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });

  return await doc.save();
}

export async function downloadLPORFPDF(
  formData: LPORFFormData,
) {
  const pdfBytes = await generateLPORFPDF(
    formData,
  );
  const blob = new Blob([pdfBytes.slice()], {
    type: "application/pdf",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download =
    "lpor_f_confidential_address_form.pdf";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
