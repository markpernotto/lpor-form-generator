import {
  PDFDocument,
  PDFFont,
  PDFPage,
  rgb,
  StandardFonts,
} from "pdf-lib";
import type { LPORFormSchema } from "./formSchema";

// Page dimensions - standard letter size
const PAGE_WIDTH = 612; // 8.5 inches * 72 points/inch
const PAGE_HEIGHT = 792; // 11 inches * 72 points/inch

// Precise font sizes to match original
const FONT_SIZES = {
  HEADER_TITLE: 12,
  FORM_LABEL: 7.5,
  FIELD_TEXT: 7,
  SMALL_TEXT: 6.5,
  TINY_TEXT: 5.5,
  CHECKBOX_LABEL: 7.5,
  SECTION_HEADER: 8.5,
} as const;

// Precise positioning coordinates
const POSITIONS = {
  // Administrative box (top right)
  ADMIN_BOX: {
    x: 455,
    y: 730,
    width: 135,
    height: 50,
  },

  // Header positioning
  HEADER: {
    TITLE_Y: 705,
    COURT_LINE_Y: 705,
    FILED_LINE_Y: 690,
    ORDER_TYPE_Y: 670,
    SUBTITLE_Y: 650,
    CONSENT_Y: 635,
  },

  // Court information fields
  COURT_INFO: {
    COURT_NAME_X: 155,
    DOCKET_X: 415,
    DIVISION_X: 525,
    FILED_X: 70,
    CLERK_X: 265,
  },

  // Petitioner section
  PETITIONER: {
    START_Y: 610,
    NAME_LINE_Y: 590,
    NAME_LABELS_Y: 577,
    DOB_SEX_RACE_Y: 560,
    PROTECTED_PERSON_Y: 540,
    OTHER_LINES_Y: 520,
  },

  // Defendant section
  DEFENDANT: {
    VS_Y: 485,
    START_Y: 470,
    NAME_Y: 455,
    ALIAS_DOB_Y: 440,
    ADDRESS_Y: 425,
    STATE_ZIP_Y: 410,
    SSN_LICENSE_Y: 390,
  },

  // Order sections
  ORDER_SECTIONS: {
    SERVICE_NOTICE_Y: 360,
    SECTION_1_Y: 340,
    SECTION_2_Y: 250,
    SECTION_3_Y: 190,
  },

  // Signature section
  SIGNATURES: {
    DATE_Y: 150,
    JUDGE_BOX_Y: 110,
    PARTIES_Y: 70,
  },

  // Service section (bottom of page)
  SERVICE: {
    SERVED_Y: 50,
    REGISTRY_Y: 35,
    DISTRIBUTION_Y: 15,
  },
} as const; // Line heights and spacing
const SPACING = {
  LINE_HEIGHT: 11,
  FIELD_HEIGHT: 9,
  SECTION_GAP: 12,
  CHECKBOX_SIZE: 6.5,
  BORDER_WIDTH: 0.8,
  UNDERLINE_WIDTH: 0.6,
} as const;

export class LPORPDFGenerator {
  private doc!: PDFDocument;
  private page!: PDFPage;
  private font!: PDFFont;
  private boldFont!: PDFFont;

  async initialize(): Promise<void> {
    this.doc = await PDFDocument.create();
    this.page = this.doc.addPage([
      PAGE_WIDTH,
      PAGE_HEIGHT,
    ]);

    // Load fonts
    this.font = await this.doc.embedFont(
      StandardFonts.Helvetica,
    );
    this.boldFont = await this.doc.embedFont(
      StandardFonts.HelveticaBold,
    );
  }

  async generatePDF(
    formData: LPORFormSchema,
  ): Promise<Uint8Array> {
    await this.initialize();

    // Draw all sections in precise order
    this.drawAdministrativeBox();
    this.drawHeader();
    this.drawCourtInformation(formData);
    this.drawOrderTypeSelection(formData);
    this.drawPetitionerSection(formData);
    this.drawDefendantSection(formData);
    this.drawOrderSections();
    this.drawSignatureSection();
    this.drawServiceSection();
    this.drawDistributionFooter();

    return await this.doc.save();
  }

  // Administrative box in top right corner
  private drawAdministrativeBox(): void {
    const { x, y, width, height } =
      POSITIONS.ADMIN_BOX;

    // Draw border with precise width
    this.page.drawRectangle({
      x,
      y,
      width,
      height,
      borderColor: rgb(0, 0, 0),
      borderWidth: SPACING.BORDER_WIDTH,
    });

    // Header - centered and properly spaced
    const headerText =
      "------FOR LPOR USE ONLY-----";
    const headerWidth =
      this.font.widthOfTextAtSize(
        headerText,
        FONT_SIZES.TINY_TEXT,
      );
    const headerX = x + (width - headerWidth) / 2;
    this.drawText(
      headerText,
      headerX,
      y + 40,
      FONT_SIZES.TINY_TEXT,
      true,
    );

    // Fields with tighter spacing and precise alignment
    this.drawText(
      "PNO#",
      x + 3,
      y + 32,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawUnderline(x + 23, y + 19, 75);

    this.drawText(
      "Date Entered:",
      x + 3,
      y + 23,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawUnderline(x + 48, y + 10, 50);

    this.drawText(
      "Initials:",
      x + 3,
      y + 14,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawUnderline(x + 28, y + 1, 22);
    this.drawText(
      "Verified by:",
      x + 55,
      y + 14,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawUnderline(x + 85, y + 1, 35);
  }

  // Main header section
  private drawHeader(): void {
    const y = POSITIONS.HEADER.TITLE_Y;

    // Main title with gray background - more precise positioning
    const titleText =
      "LOUISIANA UNIFORM ABUSE PREVENTION ORDER";
    // const titleWidth =
    //   this.boldFont.widthOfTextAtSize(
    //     titleText,
    //     FONT_SIZES.HEADER_TITLE,
    //   );
    // const titleX = (PAGE_WIDTH - titleWidth) / 2;

    // Gray background with refined styling
    this.page.drawRectangle({
      x: 24,
      y: y - 6,
      width: PAGE_WIDTH - 48,
      height: FONT_SIZES.HEADER_TITLE + 12,
      color: rgb(0.88, 0.88, 0.88),
    });

    this.drawCenteredText(
      titleText,
      y,
      FONT_SIZES.HEADER_TITLE,
      true,
    );
  }

  // Court information line
  private drawCourtInformation(
    formData: LPORFormSchema,
  ): void {
    const y = POSITIONS.HEADER.COURT_LINE_Y;

    // Labels and underlines with precise positioning
    this.drawText(
      "COURT NAME AND PARISH/CITY:",
      50,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      POSITIONS.COURT_INFO.COURT_NAME_X,
      y - 2,
      195,
    );

    this.drawText(
      "DOCKET No. :",
      365,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      POSITIONS.COURT_INFO.DOCKET_X,
      y - 2,
      85,
    );

    this.drawText(
      "DIV.:",
      505,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      POSITIONS.COURT_INFO.DIVISION_X,
      y - 2,
      45,
    );

    // Fill in data
    if (formData.courtName) {
      this.drawText(
        formData.courtName,
        POSITIONS.COURT_INFO.COURT_NAME_X + 5,
        y,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.docketNumber) {
      this.drawText(
        formData.docketNumber,
        POSITIONS.COURT_INFO.DOCKET_X + 5,
        y,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.division) {
      this.drawText(
        formData.division,
        POSITIONS.COURT_INFO.DIVISION_X + 5,
        y,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Filed line
    const filedY = POSITIONS.HEADER.FILED_LINE_Y;
    this.drawText(
      "FILED:",
      50,
      filedY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      POSITIONS.COURT_INFO.FILED_X,
      filedY - 3,
      100,
    );

    this.drawText(
      "CLERK:",
      220,
      filedY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      POSITIONS.COURT_INFO.CLERK_X,
      filedY - 3,
      120,
    );

    if (formData.filedDate) {
      this.drawText(
        this.formatDate(formData.filedDate),
        POSITIONS.COURT_INFO.FILED_X + 5,
        filedY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.clerk) {
      this.drawText(
        formData.clerk,
        POSITIONS.COURT_INFO.CLERK_X + 5,
        filedY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
  }

  // Order type selection
  private drawOrderTypeSelection(
    formData: LPORFormSchema,
  ): void {
    const y = POSITIONS.HEADER.ORDER_TYPE_Y;

    this.drawText(
      "ORDER TO",
      50,
      y,
      FONT_SIZES.SECTION_HEADER,
      true,
    );

    // Modify checkbox
    this.drawCheckbox(120, y - 2);
    if (formData.orderType === "modify") {
      this.drawFilledCheckbox(120, y - 2);
    }
    this.drawText(
      "MODIFY",
      135,
      y,
      FONT_SIZES.SECTION_HEADER,
      true,
    );

    // Dissolve checkbox
    this.drawCheckbox(200, y - 2);
    if (formData.orderType === "dissolve") {
      this.drawFilledCheckbox(200, y - 2);
    }
    this.drawText(
      "DISSOLVE",
      215,
      y,
      FONT_SIZES.SECTION_HEADER,
      true,
    );

    // Subtitle
    this.drawCenteredText(
      "A PRIOR LOUISIANA UNIFORM ABUSE PREVENTION ORDER",
      POSITIONS.HEADER.SUBTITLE_Y,
      FONT_SIZES.SECTION_HEADER,
      true,
    );

    this.drawCenteredText(
      "Pursuant to La. R.S. 9:372, La. R.S. 9:361 et seq. or La. C.C.P. Art. 3601 et seq.",
      POSITIONS.HEADER.SUBTITLE_Y - 12,
      FONT_SIZES.SMALL_TEXT,
    );

    this.drawCenteredText(
      "Court Approved Consent Agreement",
      POSITIONS.HEADER.CONSENT_Y,
      FONT_SIZES.SMALL_TEXT,
    );
  }

  // Petitioner section with precise border and layout
  private drawPetitionerSection(
    formData: LPORFormSchema,
  ): void {
    const startY = POSITIONS.PETITIONER.START_Y;
    const boxHeight = 110;
    const margin = 36;

    // Draw border around entire petitioner section with precise styling
    this.page.drawRectangle({
      x: margin - 6,
      y: startY - boxHeight,
      width: PAGE_WIDTH - margin * 2 + 6,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: SPACING.BORDER_WIDTH,
    });

    // Petitioner's name header
    this.drawText(
      "PETITIONER'S NAME :",
      margin,
      POSITIONS.PETITIONER.NAME_LINE_Y,
      FONT_SIZES.FORM_LABEL,
      true,
    );
    this.drawUnderline(
      margin + 120,
      POSITIONS.PETITIONER.NAME_LINE_Y - 3,
      400,
    );

    // Name field labels
    const labelY =
      POSITIONS.PETITIONER.NAME_LABELS_Y;
    this.drawText(
      "First",
      margin + 180,
      labelY,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "Maiden/Middle",
      margin + 280,
      labelY,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "Last",
      margin + 420,
      labelY,
      FONT_SIZES.TINY_TEXT,
    );

    // Fill in name data
    if (formData.petitioner.firstName) {
      this.drawText(
        formData.petitioner.firstName,
        margin + 125,
        POSITIONS.PETITIONER.NAME_LINE_Y,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.petitioner.maidenMiddleName) {
      this.drawText(
        formData.petitioner.maidenMiddleName,
        margin + 260,
        POSITIONS.PETITIONER.NAME_LINE_Y,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.petitioner.lastName) {
      this.drawText(
        formData.petitioner.lastName,
        margin + 400,
        POSITIONS.PETITIONER.NAME_LINE_Y,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Date of birth, sex, race line
    const dobY =
      POSITIONS.PETITIONER.DOB_SEX_RACE_Y;
    this.drawText(
      "Date of Birth",
      margin,
      dobY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(margin + 70, dobY - 3, 70);
    this.drawText(
      "month/day/year",
      margin + 75,
      dobY - 10,
      FONT_SIZES.TINY_TEXT,
    );

    if (formData.petitioner.dateOfBirth) {
      this.drawText(
        this.formatDate(
          formData.petitioner.dateOfBirth,
        ),
        margin + 75,
        dobY,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Sex checkboxes
    this.drawText(
      "Sex:",
      margin + 160,
      dobY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 190, dobY - 2);
    this.drawText(
      "F",
      margin + 202,
      dobY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 220, dobY - 2);
    this.drawText(
      "M",
      margin + 232,
      dobY,
      FONT_SIZES.FORM_LABEL,
    );

    if (formData.petitioner.sex === "F") {
      this.drawFilledCheckbox(
        margin + 190,
        dobY - 2,
      );
    } else if (formData.petitioner.sex === "M") {
      this.drawFilledCheckbox(
        margin + 220,
        dobY - 2,
      );
    }

    // Race
    this.drawText(
      "Race:",
      margin + 280,
      dobY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 310,
      dobY - 3,
      80,
    );
    if (formData.petitioner.race) {
      this.drawText(
        formData.petitioner.race,
        margin + 315,
        dobY,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Protected person section
    const protectedY =
      POSITIONS.PETITIONER.PROTECTED_PERSON_Y;
    this.drawText(
      "Protected person is:",
      margin,
      protectedY,
      FONT_SIZES.FORM_LABEL,
    );

    this.drawCheckbox(
      margin + 100,
      protectedY - 2,
    );
    this.drawText(
      "Petitioner",
      margin + 115,
      protectedY,
      FONT_SIZES.FORM_LABEL,
    );

    this.drawCheckbox(
      margin + 180,
      protectedY - 2,
    );
    this.drawText(
      "other(s)",
      margin + 195,
      protectedY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawText(
      "List other(s) name & date of birth:",
      margin + 260,
      protectedY,
      FONT_SIZES.FORM_LABEL,
    );

    if (
      formData.petitioner.protectedPersonType ===
      "petitioner"
    ) {
      this.drawFilledCheckbox(
        margin + 100,
        protectedY - 2,
      );
    } else if (
      formData.petitioner.protectedPersonType ===
      "others"
    ) {
      this.drawFilledCheckbox(
        margin + 180,
        protectedY - 2,
      );
    }

    // Other protected persons lines
    const otherY =
      POSITIONS.PETITIONER.OTHER_LINES_Y;
    this.drawUnderline(
      margin,
      otherY,
      PAGE_WIDTH - margin * 2,
    );
    this.drawUnderline(
      margin,
      otherY - 8,
      PAGE_WIDTH - margin * 2,
    );

    if (
      formData.petitioner.otherProtectedPersons
    ) {
      this.drawText(
        formData.petitioner.otherProtectedPersons,
        margin + 5,
        otherY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
  }

  // Defendant section with "V." and precise layout
  private drawDefendantSection(
    formData: LPORFormSchema,
  ): void {
    // "V." (versus) - centered with proper spacing
    this.drawCenteredText(
      "V.",
      POSITIONS.DEFENDANT.VS_Y,
      FONT_SIZES.SECTION_HEADER,
      true,
    );

    const startY = POSITIONS.DEFENDANT.START_Y;
    const boxHeight = 105;
    const margin = 48;

    // Draw border around defendant section with precise styling
    this.page.drawRectangle({
      x: margin - 3,
      y: startY - boxHeight,
      width: PAGE_WIDTH - margin * 2 + 6,
      height: boxHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: SPACING.BORDER_WIDTH,
    });

    // Defendant's name
    const nameY = POSITIONS.DEFENDANT.NAME_Y;
    this.drawText(
      "DEFENDANT'S NAME:",
      margin,
      nameY,
      FONT_SIZES.FORM_LABEL,
      true,
    );
    this.drawUnderline(
      margin + 120,
      nameY - 3,
      400,
    );

    if (formData.defendant.fullName) {
      this.drawText(
        formData.defendant.fullName,
        margin + 125,
        nameY,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Alias, DOB, Sex, Race line
    const aliasY =
      POSITIONS.DEFENDANT.ALIAS_DOB_Y;
    this.drawText(
      "Alias:",
      margin,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 30,
      aliasY - 3,
      70,
    );

    this.drawText(
      "Date of Birth:",
      margin + 120,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 175,
      aliasY - 3,
      70,
    );
    this.drawText(
      "month/day/year",
      margin + 180,
      aliasY - 10,
      FONT_SIZES.TINY_TEXT,
    );

    // Sex checkboxes for defendant
    this.drawText(
      "Sex:",
      margin + 270,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 295, aliasY - 2);
    this.drawText(
      "F",
      margin + 307,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 325, aliasY - 2);
    this.drawText(
      "M",
      margin + 337,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );

    this.drawText(
      "Race:",
      margin + 370,
      aliasY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 395,
      aliasY - 3,
      80,
    );

    // Fill defendant data
    if (formData.defendant.alias) {
      this.drawText(
        formData.defendant.alias,
        margin + 35,
        aliasY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.dateOfBirth) {
      this.drawText(
        this.formatDate(
          formData.defendant.dateOfBirth,
        ),
        margin + 180,
        aliasY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.sex === "F") {
      this.drawFilledCheckbox(
        margin + 295,
        aliasY - 2,
      );
    } else if (formData.defendant.sex === "M") {
      this.drawFilledCheckbox(
        margin + 325,
        aliasY - 2,
      );
    }
    if (formData.defendant.race) {
      this.drawText(
        formData.defendant.race,
        margin + 400,
        aliasY,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // Address section
    const addressY =
      POSITIONS.DEFENDANT.ADDRESS_Y;
    this.drawText(
      "Address:",
      margin,
      addressY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 50,
      addressY - 3,
      180,
    );
    this.drawUnderline(
      margin + 240,
      addressY - 3,
      50,
    );
    this.drawUnderline(
      margin + 300,
      addressY - 3,
      120,
    );

    // Address labels below
    this.drawText(
      "No. & Street",
      margin + 100,
      addressY - 15,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "Apt. No.",
      margin + 250,
      addressY - 15,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "City",
      margin + 340,
      addressY - 15,
      FONT_SIZES.TINY_TEXT,
    );

    // State and zip line
    const stateY =
      POSITIONS.DEFENDANT.STATE_ZIP_Y;
    this.drawUnderline(margin, stateY - 3, 100);
    this.drawUnderline(
      margin + 110,
      stateY - 3,
      80,
    );
    this.drawText(
      "State",
      margin + 30,
      stateY - 15,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "Zip Code",
      margin + 130,
      stateY - 15,
      FONT_SIZES.TINY_TEXT,
    );

    // Fill address data
    if (formData.defendant.address.street) {
      this.drawText(
        formData.defendant.address.street,
        margin + 55,
        addressY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.address.aptNumber) {
      this.drawText(
        formData.defendant.address.aptNumber,
        margin + 245,
        addressY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.address.city) {
      this.drawText(
        formData.defendant.address.city,
        margin + 305,
        addressY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.address.state) {
      this.drawText(
        formData.defendant.address.state,
        margin + 5,
        stateY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (formData.defendant.address.zipCode) {
      this.drawText(
        formData.defendant.address.zipCode,
        margin + 115,
        stateY,
        FONT_SIZES.FIELD_TEXT,
      );
    }

    // SSN and Driver's License
    const ssnY =
      POSITIONS.DEFENDANT.SSN_LICENSE_Y;
    this.drawText(
      "Social Security #:",
      margin,
      ssnY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(margin + 85, ssnY - 3, 90);

    this.drawText(
      "Dr. Lic. #",
      margin + 200,
      ssnY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 245,
      ssnY - 3,
      70,
    );

    this.drawText(
      "State",
      margin + 330,
      ssnY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 355,
      ssnY - 3,
      35,
    );

    this.drawText(
      "Exp.",
      margin + 410,
      ssnY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 430,
      ssnY - 3,
      60,
    );
    this.drawText(
      "(date)",
      margin + 440,
      ssnY - 10,
      FONT_SIZES.TINY_TEXT,
    );

    // Fill SSN and license data
    if (formData.defendant.socialSecurityNumber) {
      this.drawText(
        formData.defendant.socialSecurityNumber,
        margin + 90,
        ssnY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (
      formData.defendant.driversLicense?.number
    ) {
      this.drawText(
        formData.defendant.driversLicense.number,
        margin + 250,
        ssnY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (
      formData.defendant.driversLicense?.state
    ) {
      this.drawText(
        formData.defendant.driversLicense.state,
        margin + 360,
        ssnY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
    if (
      formData.defendant.driversLicense
        ?.expiration
    ) {
      this.drawText(
        this.formatDate(
          formData.defendant.driversLicense
            .expiration,
        ),
        margin + 435,
        ssnY,
        FONT_SIZES.FIELD_TEXT,
      );
    }
  }

  // Order sections - the main court content areas
  private drawOrderSections(): void {
    const margin = 50;

    // Service notice
    this.drawText(
      "IT IS ORDERED THAT THE DEFENDANT BE SERVED WITH A COPY OF THIS ORDER.",
      margin,
      POSITIONS.ORDER_SECTIONS.SERVICE_NOTICE_Y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    // Section 1 - Modification
    let y: number =
      POSITIONS.ORDER_SECTIONS.SECTION_1_Y;
    this.drawCheckbox(margin, y);
    this.drawText(
      "1.   IT IS HEREBY ORDERED, ADJUDGED, and DECREED that the Louisiana Uniform Abuse Prevention",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "Order issued in the above-captioned and numbered matter in the form of a",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawCheckbox(margin + 20, y);
    this.drawText(
      "Temporary Restraining Order",
      margin + 35,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 190, y);
    this.drawText(
      "Preliminary Injunction",
      margin + 205,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 340, y);
    this.drawText(
      "Permanent Injunction",
      margin + 355,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "on",
      margin + 20,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(margin + 35, y - 3, 80);
    this.drawText(
      "(month/day/year) , pursuant to:",
      margin + 120,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawCheckbox(margin + 40, y);
    this.drawText(
      "La. R.S. 9:372",
      margin + 55,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 140, y);
    this.drawText(
      "La. R.S. 9:361 et seq.",
      margin + 155,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 280, y);
    this.drawText(
      "La. C.C.P. Art. 3601 et seq.",
      margin + 295,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "is hereby modified on this date as indicated on the attached Louisiana Uniform Abuse",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "Prevention Order form LPOR 9 (if La. R.S. 9:372), LPOR 11 (if La. R.S. 9:361) or LPOR 13 (if La. C.C.C.P. Art 3601).",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawCenteredText(
      "OR",
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    // Section 2 - Dissolution
    y = POSITIONS.ORDER_SECTIONS.SECTION_2_Y;
    this.drawCheckbox(margin, y);
    this.drawText(
      "2.   IT IS HEREBY ORDERED, ADJUDGED, AND DECREED that the Louisiana Uniform Abuse",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "Prevention Order issued in the above-captioned and numbered matter in the form of a",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawCheckbox(margin + 20, y);
    this.drawText(
      "Temporary Restraining Order",
      margin + 35,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 190, y);
    this.drawText(
      "Preliminary Injunction",
      margin + 205,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 340, y);
    this.drawText(
      "Permanent Injunction",
      margin + 355,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "on",
      margin + 20,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(margin + 35, y - 3, 80);
    this.drawText(
      "(month/day/year) , pursuant to:",
      margin + 120,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawCheckbox(margin + 40, y);
    this.drawText(
      "La. R.S. 9:372",
      margin + 55,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 140, y);
    this.drawText(
      "La. R.S. 9:361 et seq.",
      margin + 155,
      y,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawCheckbox(margin + 280, y);
    this.drawText(
      "La. C.C.P. Art. 3601 et seq.",
      margin + 295,
      y,
      FONT_SIZES.FORM_LABEL,
    );

    y -= SPACING.LINE_HEIGHT;
    this.drawText(
      "be and the same is hereby dissolved .",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    // Section 3 - Court Costs
    y = POSITIONS.ORDER_SECTIONS.SECTION_3_Y;
    this.drawCheckbox(margin, y);
    this.drawText(
      "3.    THE COURT ORDERS THE DEFENDANT to pay all court costs.",
      margin + 15,
      y,
      FONT_SIZES.FORM_LABEL,
      true,
    );
  }

  // Signature section with judge box
  private drawSignatureSection(): void {
    const margin = 50;

    // Date of Order
    const dateY = POSITIONS.SIGNATURES.DATE_Y;
    this.drawText(
      "Date of Order",
      margin,
      dateY,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 70,
      dateY - 3,
      100,
    );
    this.drawText(
      "month/day/year",
      margin + 75,
      dateY - 12,
      FONT_SIZES.TINY_TEXT,
    );

    // Judge signature box with border
    const judgeY =
      POSITIONS.SIGNATURES.JUDGE_BOX_Y;
    this.page.drawRectangle({
      x: margin - 5,
      y: judgeY - 25,
      width: 280,
      height: 30,
      borderColor: rgb(0, 0, 0),
      borderWidth: 2,
    });

    this.drawUnderline(margin, judgeY, 180);
    this.drawText(
      "SIGNATURE OF JUDGE",
      margin + 190,
      judgeY,
      FONT_SIZES.FORM_LABEL,
    );

    this.drawUnderline(margin, judgeY - 12, 180);
    this.drawText(
      "PRINT OR STAMP JUDGE'S NAME",
      margin + 190,
      judgeY - 12,
      FONT_SIZES.FORM_LABEL,
    );

    // Petitioner and Defendant signatures
    const partiesY =
      POSITIONS.SIGNATURES.PARTIES_Y;
    this.drawUnderline(margin, partiesY, 140);
    this.drawUnderline(
      margin + 200,
      partiesY,
      140,
    );

    this.drawText(
      "PETITIONER",
      margin + 40,
      partiesY - 12,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawText(
      "DEFENDANT",
      margin + 240,
      partiesY - 12,
      FONT_SIZES.FORM_LABEL,
    );
  }

  // Service information section
  private drawServiceSection(): void {
    const margin = 50;

    // Service at hearing
    const servedY = POSITIONS.SERVICE.SERVED_Y;
    this.drawCheckbox(margin, servedY);
    this.drawText(
      "DEFENDANT WAS SERVED AT CLOSE OF HEARING.",
      margin + 15,
      servedY,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    this.drawText(
      "Date",
      margin,
      servedY - 12,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 25,
      servedY - 15,
      80,
    );
    this.drawText(
      "Clerk",
      margin + 120,
      servedY - 12,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 145,
      servedY - 15,
      100,
    );

    // Registry transmission
    const registryY =
      POSITIONS.SERVICE.REGISTRY_Y;
    this.drawCheckbox(margin, registryY);
    this.drawText(
      "FAXED OR ELECTRONICALLY TRANSMITTED TO LOUISIANA PROTECTIVE ORDER REGISTRY",
      margin + 15,
      registryY,
      FONT_SIZES.FORM_LABEL,
      true,
    );

    this.drawText(
      "Date",
      margin,
      registryY - 12,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 25,
      registryY - 15,
      80,
    );
    this.drawText(
      "Clerk",
      margin + 120,
      registryY - 12,
      FONT_SIZES.FORM_LABEL,
    );
    this.drawUnderline(
      margin + 145,
      registryY - 15,
      100,
    );
  }

  // Distribution footer
  private drawDistributionFooter(): void {
    const y = POSITIONS.SERVICE.DISTRIBUTION_Y;
    this.drawText(
      "Copies to:   1) Court file   2) Petitioner/protected person(s)   3)  Defendant   4) Chief Law Enforcement Official of the",
      50,
      y,
      FONT_SIZES.TINY_TEXT,
    );
    this.drawText(
      "parish where the protected  person(s) resides  5) Louisiana Protective Order Registry.",
      50,
      y - 8,
      FONT_SIZES.TINY_TEXT,
    );

    // Version number in bottom right
    this.drawText(
      "v.8",
      PAGE_WIDTH - 50,
      y,
      FONT_SIZES.TINY_TEXT,
    );
  }

  // Basic drawing utility methods
  // Basic drawing utility methods
  private drawText(
    text: string,
    x: number,
    y: number,
    size: number,
    bold: boolean = false,
  ): void {
    this.page.drawText(text, {
      x,
      y,
      size,
      font: bold ? this.boldFont : this.font,
      color: rgb(0, 0, 0),
    });
  }

  private drawCenteredText(
    text: string,
    y: number,
    size: number,
    bold: boolean = false,
  ): void {
    const font = bold ? this.boldFont : this.font;
    const textWidth = font.widthOfTextAtSize(
      text,
      size,
    );
    const x = (PAGE_WIDTH - textWidth) / 2;
    this.drawText(text, x, y, size, bold);
  }

  private drawUnderline(
    x: number,
    y: number,
    width: number,
  ): void {
    this.page.drawLine({
      start: { x, y },
      end: { x: x + width, y },
      thickness: SPACING.UNDERLINE_WIDTH,
      color: rgb(0, 0, 0),
    });
  }

  private drawCheckbox(
    x: number,
    y: number,
    size: number = SPACING.CHECKBOX_SIZE,
  ): void {
    this.page.drawRectangle({
      x,
      y,
      width: size,
      height: size,
      borderColor: rgb(0, 0, 0),
      borderWidth: SPACING.UNDERLINE_WIDTH,
    });
  }

  private drawFilledCheckbox(
    x: number,
    y: number,
    size: number = SPACING.CHECKBOX_SIZE,
  ): void {
    this.drawCheckbox(x, y, size);
    // Draw X mark with precise thickness
    const markThickness =
      SPACING.UNDERLINE_WIDTH + 0.2;
    this.page.drawLine({
      start: { x: x + 0.8, y: y + 0.8 },
      end: {
        x: x + size - 0.8,
        y: y + size - 0.8,
      },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });
    this.page.drawLine({
      start: { x: x + size - 0.8, y: y + 0.8 },
      end: { x: x + 0.8, y: y + size - 0.8 },
      thickness: markThickness,
      color: rgb(0, 0, 0),
    });
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  }
}
