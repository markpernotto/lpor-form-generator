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
    x: 150,
    y: y,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 20;

  page.drawText(
    "LOUISIANA UNIFORM ABUSE PREVENTION ORDER",
    {
      x: 130,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText("(LPOR F)", {
    x: 280,
    y: y,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Court info
  page.drawText(
    `COURT: ${
      formData.courtName || "_________________"
    }`,
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );

  page.drawText(
    `DOCKET NO.: ${
      formData.docketNumber || "_________"
    }`,
    {
      x: 350,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 30;

  // Case caption
  const petitionerName =
    `${formData.petitioner.firstName} ${formData.petitioner.maidenMiddleName} ${formData.petitioner.lastName}`.trim();
  page.drawText(petitionerName, {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 15;

  page.drawText("Petitioner", {
    x: 50,
    y: y,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  page.drawText("v.", {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 25;

  page.drawText(formData.defendant.fullName, {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 15;

  page.drawText("Defendant", {
    x: 50,
    y: y,
    size: 8,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 40;

  // Main content
  page.drawText(
    "TO THE COURT: The petitioner requests that the following address",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "information be kept confidential pursuant to R.S. 46:2136.2.",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 30;

  page.drawText(
    "PETITIONER'S CONFIDENTIAL INFORMATION:",
    {
      x: 50,
      y: y,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  y -= 20;

  // Address info
  const address = `${
    formData.petitioner.address.street
  }${
    formData.petitioner.address.aptNumber
      ? " " +
        formData.petitioner.address.aptNumber
      : ""
  }`;
  page.drawText(`ADDRESS: ${address}`, {
    x: 50,
    y: y,
    size: 10,
    font: font,
    color: rgb(0, 0, 0),
  });
  y -= 15;

  page.drawText(
    `CITY: ${formData.petitioner.address.city}  STATE: ${formData.petitioner.address.state}  ZIP: ${formData.petitioner.address.zipCode}`,
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  if (formData.petitioner.phoneNumber) {
    page.drawText(
      `TELEPHONE: ${formData.petitioner.phoneNumber}`,
      {
        x: 50,
        y: y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      },
    );
    y -= 15;
  }

  if (formData.petitioner.email) {
    page.drawText(
      `EMAIL: ${formData.petitioner.email}`,
      {
        x: 50,
        y: y,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      },
    );
    y -= 15;
  }

  y -= 20;

  // Work info
  page.drawText(
    "WORK ADDRESS: _________________________________",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "CITY: ____________  STATE: ____  ZIP: _______",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "WORK TELEPHONE: _________________",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 30;

  // Children info
  page.drawText(
    "CHILDREN'S INFORMATION (if applicable):",
    {
      x: 50,
      y: y,
      size: 10,
      font: boldFont,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "SCHOOL/DAYCARE: _________________________________",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "ADDRESS: _______________________________________",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 15;

  page.drawText(
    "CITY: ____________  STATE: ____  ZIP: _______",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 80;

  // Signature section
  page.drawText(
    `DATE: ${
      formData.signatures.dateOfFiling ||
      "__________"
    }`,
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 30;

  page.drawText(
    "SIGNATURE OF PETITIONER: _________________________",
    {
      x: 50,
      y: y,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    },
  );
  y -= 20;

  page.drawText(`PRINT NAME: ${petitionerName}`, {
    x: 50,
    y: y,
    size: 10,
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
