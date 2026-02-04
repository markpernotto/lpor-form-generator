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

  // Title
  page.drawText("CONFIDENTIAL ADDRESS FORM", {
    x: 200,
    y: 650,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "TO BE USED WHEN PETITIONER DOES NOT WANT DEFENDANT",
    {
      x: 130,
      y: 630,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("TO LEARN ADDRESS", {
    x: 250,
    y: 615,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "PETITION FOR PROTECTION FROM ABUSE",
    {
      x: 210,
      y: 595,
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
    `${formData.petitioner?.firstName || ""} ${formData.petitioner?.maidenMiddleName || ""} ${formData.petitioner?.lastName || ""}`.trim();
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

  page.drawText(
    formData.defendant?.fullName || "",
    {
      x: 50,
      y: 717,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
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
    formData.defendant?.parentGuardianName ?? "",
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

  // Main content
  page.drawText("The petition of", {
    x: 50,
    y: 560,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(petitionerName, {
    x: 120,
    y: 562,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("your name", {
    x: 180,
    y: 552,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 120, y: 560 },
    end: { x: 325, y: 560 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(", born", {
    x: 325,
    y: 560,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner?.dateOfBirth
      ? formData.petitioner.dateOfBirth
      : "",
    {
      x: 365,
      y: 562,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("your date of birth", {
    x: 380,
    y: 552,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 355, y: 560 },
    end: { x: 465, y: 560 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  page.drawText(", a resident of the ", {
    x: 465,
    y: 560,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("State of ", {
    x: 50,
    y: 530,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.defendant?.address?.state || "",
    {
      x: 100,
      y: 532,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 90, y: 530 },
    end: { x: 180, y: 530 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(", respectfully represents:", {
    x: 180,
    y: 530,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText("Paragraph 1", {
    x: 260,
    y: 505,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(
    "Petitioner files this petition on behalf of:",
    {
      x: 50,
      y: 485,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("a. ", {
    x: 50,
    y: 465,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose?.forPetitioner
      ? "x"
      : "",
    {
      x: 70,
      y: 467,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 465 },
    end: { x: 90, y: 465 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText("Petitioner, and/or", {
    x: 100,
    y: 465,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("b. ", {
    x: 50,
    y: 445,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose?.forMinorChildren
      ? "x"
      : "",
    {
      x: 70,
      y: 447,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 445 },
    end: { x: 90, y: 445 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "Minor child(ren) as follows: (Name, Date of Birth, Relationship to Petitioner) ",
    {
      x: 100,
      y: 445,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 70, y: 425 },
    end: { x: 250, y: 425 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 425 },
    end: { x: 360, y: 425 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 425 },
    end: { x: 580, y: 425 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 405 },
    end: { x: 250, y: 405 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 405 },
    end: { x: 360, y: 405 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 405 },
    end: { x: 580, y: 405 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 385 },
    end: { x: 250, y: 385 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 385 },
    end: { x: 360, y: 385 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 385 },
    end: { x: 580, y: 385 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 365 },
    end: { x: 250, y: 365 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 365 },
    end: { x: 360, y: 365 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 365 },
    end: { x: 580, y: 365 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 345 },
    end: { x: 250, y: 345 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 345 },
    end: { x: 360, y: 345 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 345 },
    end: { x: 580, y: 345 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  formData.minorChildren.forEach(
    (child, index) => {
      if (index >= 6) return; // Limit to 6 entries for space
      const entryY = 420 - index * 20 + 2 + 5;
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
    y: 305,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.filingPurpose?.forAllegedIncompetent
      ? "x"
      : "",
    {
      x: 70,
      y: 307,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 65, y: 305 },
    end: { x: 90, y: 305 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "Alleged incompetent as follows: (Name, Date of Birth, Relationship to Petitioner) ",
    {
      x: 100,
      y: 305,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 70, y: 285 },
    end: { x: 250, y: 285 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 285 },
    end: { x: 360, y: 285 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 285 },
    end: { x: 580, y: 285 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 70, y: 265 },
    end: { x: 250, y: 265 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 270, y: 265 },
    end: { x: 360, y: 265 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 380, y: 265 },
    end: { x: 580, y: 265 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  formData.allegedIncompetent.forEach(
    (child, index) => {
      if (index >= 1) return; // Limit to 2 entries for space
      const entryY = 280 - index * 20 + 2 + 5;
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
    y: 235,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Petitioner's current address:", {
    x: 50,
    y: 220,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawLine({
    start: { x: 100, y: 200 },
    end: { x: 580, y: 200 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner?.address?.street || "",
    {
      x: 100,
      y: 202,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("No. & Street", {
    x: 100,
    y: 190,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Apt. No.", {
    x: 300,
    y: 190,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner?.address?.aptNumber ?? "",
    {
      x: 300,
      y: 202,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 170 },
    end: { x: 580, y: 170 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.petitioner?.address?.city || "",
    {
      x: 100,
      y: 172,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.petitioner?.address?.state || "",
    {
      x: 300,
      y: 172,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.petitioner?.address?.zipCode || "",
    {
      x: 500,
      y: 172,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("City", {
    x: 100,
    y: 160,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("State", {
    x: 300,
    y: 160,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Zip Code", {
    x: 500,
    y: 160,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });

  page.drawText(
    "The minor child(ren)'s or incompetent's current address:",
    {
      x: 50,
      y: 130,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 110 },
    end: { x: 580, y: 110 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.street ?? "",
    {
      x: 100,
      y: 112,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("No. & Street", {
    x: 100,
    y: 100,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Apt. No.", {
    x: 300,
    y: 100,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.aptNumber ??
      "",
    {
      x: 300,
      y: 112,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawLine({
    start: { x: 100, y: 80 },
    end: { x: 580, y: 80 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    formData.minorChildrenAddress?.city ?? "",
    {
      x: 100,
      y: 82,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.minorChildrenAddress?.state ?? "",
    {
      x: 300,
      y: 82,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText(
    formData.minorChildrenAddress?.zipCode ?? "",
    {
      x: 500,
      y: 82,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  page.drawText("City", {
    x: 100,
    y: 70,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("State", {
    x: 300,
    y: 70,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  page.drawText("Zip Code", {
    x: 500,
    y: 70,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });

  return await doc.save();
}

export async function downloadLPORFPDF(
  formData: LPORFFormData,
) {
  const pdfBytes =
    await generateLPORFPDF(formData);
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
