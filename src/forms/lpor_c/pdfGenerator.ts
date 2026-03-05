/**
 * Form C: Request for Child Custody (LPOR-C)
 *
 * Uses the official LPOR-C multi-page template when available and overlays
 * intake data onto known coordinates.
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

function drawFieldTextWithin(
  page: PDFPage,
  font: PDFFont,
  value: string | undefined,
  x: number,
  y: number,
  maxWidth: number,
  size: number = 10,
): void {
  let text = textOrEmpty(value);
  if (!text) return;

  while (
    text.length > 0 &&
    font.widthOfTextAtSize(text, size) > maxWidth
  ) {
    text = text.slice(0, -1);
  }

  if (!text) return;

  page.drawText(text, {
    x,
    y,
    size,
    font,
    color: rgb(0, 0, 0),
  });
}

function hasAnyAddress(
  formData: MasterFormData,
): boolean {
  return Boolean(
    textOrEmpty(
      formData.current_address_street,
    ) ||
    textOrEmpty(formData.current_address_apt) ||
    textOrEmpty(formData.current_address_city) ||
    textOrEmpty(formData.current_address_state) ||
    textOrEmpty(formData.current_address_zip),
  );
}

function formatDateForCourt(
  value: string | undefined,
): string {
  const raw = textOrEmpty(value);
  if (!raw) return "";

  const isoMatch = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})$/,
  );
  if (isoMatch) {
    return `${isoMatch[2]}/${isoMatch[3]}/${isoMatch[1]}`;
  }

  const slashMatch = raw.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
  );
  if (slashMatch) {
    const mm = slashMatch[1].padStart(2, "0");
    const dd = slashMatch[2].padStart(2, "0");
    return `${mm}/${dd}/${slashMatch[3]}`;
  }

  return raw;
}

function drawCheckmark(
  page: PDFPage,
  font: PDFFont,
  checked: boolean | undefined,
  x: number,
  y: number,
): void {
  if (!checked) return;
  page.drawText("X", {
    x,
    y,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });
}

function isFillAllTestMode(
  formData: MasterFormData,
): boolean {
  return Boolean(
    (
      formData as unknown as {
        debug_fill_all_fields?: boolean;
      }
    ).debug_fill_all_fields,
  );
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line
      ? `${line} ${word}`
      : word;
    const width = font.widthOfTextAtSize(
      candidate,
      size,
    );

    if (line && width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }

  if (line) lines.push(line);
  return lines;
}

function drawParagraphWithFirstLineIndent(
  page: PDFPage,
  font: PDFFont,
  value: string | undefined,
  options: {
    firstLineX: number;
    continuationX: number;
    startY: number;
    rightX: number;
    lineHeight: number;
    maxLines: number;
    size?: number;
  },
): void {
  const raw = textOrEmpty(value);
  if (!raw) return;

  const size = options.size ?? 9;
  const text = raw.replace(/\s+/g, " ").trim();
  if (!text) return;

  const words = text.split(" ");
  const lines: Array<{
    text: string;
    x: number;
  }> = [];
  let currentLine = "";
  let currentX = options.firstLineX;

  for (const word of words) {
    const candidate = currentLine
      ? `${currentLine} ${word}`
      : word;
    const maxWidth = options.rightX - currentX;
    const candidateWidth = font.widthOfTextAtSize(
      candidate,
      size,
    );

    if (
      currentLine &&
      candidateWidth > maxWidth
    ) {
      lines.push({
        text: currentLine,
        x: currentX,
      });
      currentLine = word;
      currentX = options.continuationX;
    } else {
      currentLine = candidate;
    }
  }

  if (currentLine) {
    lines.push({
      text: currentLine,
      x: currentX,
    });
  }

  let y = options.startY;
  for (const line of lines.slice(
    0,
    options.maxLines,
  )) {
    drawFieldText(
      page,
      font,
      line.text,
      line.x,
      y,
      size,
    );
    y -= options.lineHeight;
  }
}

type AddressParts = {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
};

function parseAddressParts(
  rawValue: string | undefined,
): AddressParts {
  const raw = textOrEmpty(rawValue);
  if (!raw) {
    return {
      street: "",
      apt: "",
      city: "",
      state: "",
      zip: "",
    };
  }

  const parts = raw
    .split(",")
    .map((p) => p.trim());
  const street = parts[0] ?? "";
  const city = parts[1] ?? "";
  const stateZip = parts[2] ?? "";
  const explicitZip = parts[3] ?? "";

  let state = "";
  let zip = "";
  const fullStateZipMatch = stateZip.match(
    /^([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)$/,
  );
  const stateOnlyMatch = stateZip.match(
    /^([A-Za-z]{2})$/,
  );
  const zipOnlyMatch = stateZip.match(
    /^(\d{5}(?:-\d{4})?)$/,
  );

  if (fullStateZipMatch) {
    state = fullStateZipMatch[1];
    zip = fullStateZipMatch[2];
  } else if (stateOnlyMatch) {
    state = stateOnlyMatch[1];
  } else if (zipOnlyMatch) {
    zip = zipOnlyMatch[1];
  }

  if (!zip && explicitZip) {
    const explicitZipMatch = explicitZip.match(
      /^(\d{5}(?:-\d{4})?)$/,
    );
    if (explicitZipMatch) {
      zip = explicitZipMatch[1];
    }
  }

  return {
    street,
    apt: "",
    city,
    state,
    zip,
  };
}

function overlayPage1(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  drawCheckmark(
    page,
    font,
    formData.filing_type === "initial",
    232,
    724,
  );
  drawCheckmark(
    page,
    font,
    formData.filing_type === "supplemental" ||
      formData.form_br_needed === true,
    311,
    724,
  );

  drawFieldTextWithin(
    page,
    font,
    formData.petitioner_full_name ||
      formData.full_name,
    155,
    703,
    260,
    9,
  );
  drawFieldTextWithin(
    page,
    font,
    formatDateForCourt(
      formData.petitioner_birth_date ||
        formData.birth_date,
    ),
    455,
    703,
    175,
    9,
  );

  drawFieldText(
    page,
    font,
    formData.petitioner_full_name ||
      formData.full_name,
    70,
    886,
    9,
  );

  drawFieldText(
    page,
    font,
    formData.abuser_name,
    70,
    831,
    9,
  );

  drawFieldText(
    page,
    font,
    formData.parent_guardian_name,
    70,
    804,
    9,
  );

  const protection =
    formData.who_needs_protection || [];
  drawCheckmark(
    page,
    font,
    protection.includes("self") ||
      formData.filing_for === "self",
    96,
    607,
  );
  drawCheckmark(
    page,
    font,
    formData.have_children ||
      protection.includes("children"),
    96,
    588,
  );
  drawCheckmark(
    page,
    font,
    formData.protecting_incompetent ||
      protection.includes("incompetent"),
    96,
    443,
  );

  (formData.children || [])
    .slice(0, 6)
    .forEach((child, index) => {
      const y = 569 - index * 19;
      drawFieldText(
        page,
        font,
        child.name,
        104,
        y,
      );
      drawFieldText(
        page,
        font,
        child.dateOfBirth,
        299,
        y,
      );
      drawFieldText(
        page,
        font,
        child.relationshipToPetitioner,
        384,
        y,
      );
    });

  (formData.incompetent_persons || [])
    .slice(0, 2)
    .forEach((person, index) => {
      const y = 408 - index * 19;
      const textY = y + 19;
      drawFieldText(
        page,
        font,
        person.name,
        104,
        textY,
      );
      drawFieldText(
        page,
        font,
        person.dateOfBirth,
        299,
        textY,
      );
      drawFieldText(
        page,
        font,
        person.relationshipToPetitioner,
        384,
        textY,
      );
    });

  const petitionerAddressIsPrivate =
    formData.keep_address_private === true;
  const petitionerHasAddress =
    hasAnyAddress(formData);
  const hasChildrenOrIncompetent =
    (formData.children || []).length > 0 ||
    (formData.incompetent_persons || []).length >
      0 ||
    formData.have_children === true ||
    formData.protecting_incompetent === true;

  drawCheckmark(
    page,
    font,
    petitionerAddressIsPrivate,
    88,
    353,
  );
  drawCheckmark(
    page,
    font,
    !petitionerAddressIsPrivate &&
      petitionerHasAddress,
    88,
    288,
  );
  drawCheckmark(
    page,
    font,
    hasChildrenOrIncompetent,
    88,
    200,
  );

  if (!petitionerAddressIsPrivate) {
    drawFieldText(
      page,
      font,
      formData.current_address_street,
      128,
      272,
      9,
    );
    drawFieldText(
      page,
      font,
      formData.current_address_apt,
      466,
      272,
      9,
    );
    drawFieldText(
      page,
      font,
      formData.current_address_city,
      128,
      240,
      9,
    );
    drawFieldText(
      page,
      font,
      formData.current_address_state,
      389,
      240,
      9,
    );
    drawFieldText(
      page,
      font,
      formData.current_address_zip,
      496,
      240,
      9,
    );
  }

  if (hasChildrenOrIncompetent) {
    const sameAddressAsPetitioner =
      formData.children_same_address !== false;

    drawFieldText(
      page,
      font,
      sameAddressAsPetitioner
        ? formData.current_address_street
        : undefined,
      128,
      188,
      9,
    );
    drawFieldText(
      page,
      font,
      sameAddressAsPetitioner
        ? formData.current_address_apt
        : undefined,
      466,
      188,
      9,
    );
    drawFieldText(
      page,
      font,
      sameAddressAsPetitioner
        ? formData.current_address_city
        : undefined,
      128,
      154,
      9,
    );
    drawFieldText(
      page,
      font,
      sameAddressAsPetitioner
        ? formData.current_address_state
        : undefined,
      318,
      154,
      9,
    );
    drawFieldText(
      page,
      font,
      sameAddressAsPetitioner
        ? formData.current_address_zip
        : undefined,
      444,
      154,
      9,
    );
  }

  const needsInterpreter =
    formData.need_interpreter === true ||
    textOrEmpty(formData.interpreter_language)
      .length > 0;
  drawCheckmark(
    page,
    font,
    needsInterpreter,
    88,
    103,
  );
  drawCheckmark(
    page,
    font,
    needsInterpreter,
    126,
    81,
  );

  drawFieldText(
    page,
    font,
    formData.interpreter_language,
    378,
    86,
    9,
  );
}

function overlayPage2(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const fillAll = isFillAllTestMode(formData);
  const page2 = {
    witnessLanguage: {
      checkboxX: 128,
      checkboxY: 885,
      textX: 332,
      textY: 886,
    },
    criminalHistory: {
      lineCheckboxX: 90,
      lineCheckboxY: 867,
      defendantCheckboxX: 127,
      defendantCheckboxY: 847,
      witnessCheckboxX: 127,
      witnessCheckboxY: 831,
    },
    defendantAddress: {
      nameX: 85,
      nameY: 785,
      parishX: 400,
      parishY: 785,
      streetX: 85,
      streetY: 755,
      aptX: 280,
      aptY: 755,
      cityX: 340,
      cityY: 755,
      stateX: 430,
      stateY: 755,
      zipX: 490,
      zipY: 755,
    },
    venue: {
      maritalDomicileX: 70,
      maritalDomicileY: 675,
      maritalDomicileParishX: 230,
      maritalDomicileParishY: 675,
      householdLocationX: 70,
      householdLocationY: 657,
      householdLocationParishX: 230,
      householdLocationParishY: 657,
      defendantResidesX: 70,
      defendantResidesY: 639,
      defendantResidesParishX: 270,
      defendantResidesParishY: 639,
      abuseOccurredX: 70,
      abuseOccurredY: 621,
      abuseOccurredParishX: 210,
      abuseOccurredParishY: 621,
      protectedPersonDomicileX: 70,
      protectedPersonDomicileY: 603,
      protectedPersonDomicileParishX: 260,
      protectedPersonDomicileParishY: 603,
      protectedPersonResidesX: 70,
      protectedPersonResidesY: 565,
      protectedPersonResidesParishX: 250,
      protectedPersonResidesParishY: 565,
    },
    relationship: {
      currentFormerSpouseX: 95,
      currentFormerSpouseY: 487,
      currentFormerIntimateInhabitantX: 95,
      currentFormerIntimateInhabitantY: 470,
      childStepchildFosterX: 95,
      childStepchildFosterY: 453,
      childOfDefendantX: 95,
      childOfDefendantY: 436,
      currentFormerDatingPartnerX: 335,
      currentFormerDatingPartnerY: 487,
      parentStepparentGuardianX: 335,
      parentStepparentGuardianY: 470,
      grandchildX: 335,
      grandchildY: 453,
      protectedPersonChildrenInCommonX: 87,
      protectedPersonChildrenInCommonY: 419,
    },
    relatedLegalAction: {
      divorceNotPendingX: 70,
      divorceNotPendingY: 380,
      divorcePendingX: 70,
      divorcePendingY: 360,
      suitForCustodyX: 70,
      suitForCustodyY: 315,
      custodyOrderX: 70,
      custodyOrderY: 292,
    },
    descriptionOfAbuse: {
      slappedX: 95,
      slappedY: 195,
      punchedX: 95,
      punchedY: 177,
      chokedX: 95,
      chokedY: 158,
      shovedX: 95,
      shovedY: 139,
      kickedX: 95,
      kickedY: 120,
      stalkedX: 95,
      stalkedY: 101,
      physicallyAbusedPregnantX: 95,
      physicallyAbusedPregnantY: 82,
      threatenedWithHarmX: 295,
      threatenedWithHarmY: 195,
      threatenedLifeX: 295,
      threatenedLifeY: 177,
      threatenedWeaponX: 295,
      threatenedWeaponY: 158,
      sexuallyAbusedX: 295,
      sexuallyAbusedY: 139,
      abusedChildrenX: 295,
      abusedChildrenY: 120,
      abusedPetsX: 295,
      abusedPetsY: 101,
    },
  } as const;

  const witnessInterpreterNeeded =
    formData.witness_interpreter === true ||
    textOrEmpty(formData.witness_language)
      .length > 0;

  drawCheckmark(
    page,
    font,
    witnessInterpreterNeeded,
    page2.witnessLanguage.checkboxX,
    page2.witnessLanguage.checkboxY,
  );
  drawFieldText(
    page,
    font,
    formData.witness_language,
    page2.witnessLanguage.textX,
    page2.witnessLanguage.textY,
    9,
  );

  const criminalHistoryRequested =
    formData.request_criminal_history === true ||
    formData.need_witness_criminal_check === true;
  drawCheckmark(
    page,
    font,
    criminalHistoryRequested,
    page2.criminalHistory.lineCheckboxX,
    page2.criminalHistory.lineCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    criminalHistoryRequested,
    page2.criminalHistory.defendantCheckboxX,
    page2.criminalHistory.defendantCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    formData.need_witness_criminal_check === true,
    page2.criminalHistory.witnessCheckboxX,
    page2.criminalHistory.witnessCheckboxY,
  );

  drawFieldTextWithin(
    page,
    font,
    formData.abuser_name,
    page2.defendantAddress.nameX,
    page2.defendantAddress.nameY,
    215,
    9,
  );
  drawFieldTextWithin(
    page,
    font,
    formData.abuser_parish ||
      formData.filing_parish,
    page2.defendantAddress.parishX,
    page2.defendantAddress.parishY,
    90,
    9,
  );

  drawFieldText(
    page,
    font,
    formData.abuser_address_street,
    page2.defendantAddress.streetX,
    page2.defendantAddress.streetY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.abuser_address_apt,
    page2.defendantAddress.aptX,
    page2.defendantAddress.aptY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.abuser_address_city,
    page2.defendantAddress.cityX,
    page2.defendantAddress.cityY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.abuser_address_state,
    page2.defendantAddress.stateX,
    page2.defendantAddress.stateY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.abuser_address_zip,
    page2.defendantAddress.zipX,
    page2.defendantAddress.zipY,
    9,
  );

  const venueReasons = new Set([
    ...(formData.venue_reasons || []),
    ...(formData.venue_reason || []),
  ]);
  const venueParish = textOrEmpty(
    formData.filing_parish ||
      formData.abuser_parish,
  );

  const maritalChecked = venueReasons.has(
    "marital_home",
  );
  const householdChecked =
    venueReasons.has("household");
  const defendantChecked =
    venueReasons.has("defendant_lives") ||
    venueReasons.has("defendant_lives_here") ||
    venueReasons.has("abuser_lives_here");
  const abuseChecked =
    venueReasons.has("abuse_occurred") ||
    venueReasons.has("abuse_happened_here");
  const petitionerChecked = venueReasons.has(
    "i_live_here",
  );
  const canShowProtectedAddressLines =
    formData.keep_address_private !== true;

  drawCheckmark(
    page,
    font,
    maritalChecked,
    page2.venue.maritalDomicileX,
    page2.venue.maritalDomicileY,
  );
  drawFieldTextWithin(
    page,
    font,
    maritalChecked ? venueParish : "",
    page2.venue.maritalDomicileParishX,
    page2.venue.maritalDomicileParishY,
    170,
    9,
  );

  drawCheckmark(
    page,
    font,
    householdChecked,
    page2.venue.householdLocationX,
    page2.venue.householdLocationY,
  );
  drawFieldTextWithin(
    page,
    font,
    householdChecked ? venueParish : "",
    page2.venue.householdLocationParishX,
    page2.venue.householdLocationParishY,
    170,
    9,
  );

  drawCheckmark(
    page,
    font,
    defendantChecked,
    page2.venue.defendantResidesX,
    page2.venue.defendantResidesY,
  );
  drawFieldTextWithin(
    page,
    font,
    defendantChecked ? venueParish : "",
    page2.venue.defendantResidesParishX,
    page2.venue.defendantResidesParishY,
    170,
    9,
  );

  drawCheckmark(
    page,
    font,
    abuseChecked,
    page2.venue.abuseOccurredX,
    page2.venue.abuseOccurredY,
  );
  drawFieldTextWithin(
    page,
    font,
    abuseChecked ? venueParish : "",
    page2.venue.abuseOccurredParishX,
    page2.venue.abuseOccurredParishY,
    170,
    9,
  );

  drawCheckmark(
    page,
    font,
    petitionerChecked &&
      canShowProtectedAddressLines,
    page2.venue.protectedPersonDomicileX,
    page2.venue.protectedPersonDomicileY,
  );
  drawFieldTextWithin(
    page,
    font,
    petitionerChecked &&
      canShowProtectedAddressLines
      ? venueParish
      : "",
    page2.venue.protectedPersonDomicileParishX,
    page2.venue.protectedPersonDomicileParishY,
    170,
    9,
  );

  drawCheckmark(
    page,
    font,
    petitionerChecked &&
      canShowProtectedAddressLines,
    page2.venue.protectedPersonResidesX,
    page2.venue.protectedPersonResidesY,
  );
  drawFieldTextWithin(
    page,
    font,
    petitionerChecked &&
      canShowProtectedAddressLines
      ? venueParish
      : "",
    page2.venue.protectedPersonResidesParishX,
    page2.venue.protectedPersonResidesParishY,
    170,
    9,
  );

  const drawAllSectionX = (
    section:
      | typeof page2.relationship
      | typeof page2.relatedLegalAction
      | typeof page2.descriptionOfAbuse,
    checked: boolean,
  ) => {
    for (const [key, value] of Object.entries(
      section,
    )) {
      if (!key.endsWith("X")) continue;
      const base = key.slice(0, -1);
      const yKey =
        `${base}Y` as keyof typeof section;
      const y = section[yKey];
      if (typeof y !== "number") continue;
      drawCheckmark(
        page,
        font,
        checked,
        value,
        y,
      );
    }
  };

  if (fillAll) {
    drawAllSectionX(page2.relationship, true);
    drawAllSectionX(
      page2.relatedLegalAction,
      true,
    );
    drawAllSectionX(
      page2.descriptionOfAbuse,
      true,
    );
  } else {
    const relationshipType = textOrEmpty(
      formData.relationship_type,
    ).toLowerCase();
    drawCheckmark(
      page,
      font,
      relationshipType.includes("spouse"),
      page2.relationship.currentFormerSpouseX,
      page2.relationship.currentFormerSpouseY,
    );
    drawCheckmark(
      page,
      font,
      relationshipType.includes("dating"),
      page2.relationship
        .currentFormerDatingPartnerX,
      page2.relationship
        .currentFormerDatingPartnerY,
    );
    drawCheckmark(
      page,
      font,
      formData.children_together === true ||
        formData.have_child_together === true,
      page2.relationship
        .protectedPersonChildrenInCommonX,
      page2.relationship
        .protectedPersonChildrenInCommonY,
    );

    drawCheckmark(
      page,
      font,
      formData.divorce_pending === false,
      page2.relatedLegalAction.divorceNotPendingX,
      page2.relatedLegalAction.divorceNotPendingY,
    );
    drawCheckmark(
      page,
      font,
      formData.divorce_pending === true,
      page2.relatedLegalAction.divorcePendingX,
      page2.relatedLegalAction.divorcePendingY,
    );
    drawCheckmark(
      page,
      font,
      formData.custody_case_pending === true,
      page2.relatedLegalAction.suitForCustodyX,
      page2.relatedLegalAction.suitForCustodyY,
    );
    drawCheckmark(
      page,
      font,
      formData.custody_order_exists === true,
      page2.relatedLegalAction.custodyOrderX,
      page2.relatedLegalAction.custodyOrderY,
    );

    const abuseTypes = new Set(
      formData.abuse_types || [],
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("physical"),
      page2.descriptionOfAbuse.slappedX,
      page2.descriptionOfAbuse.slappedY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("physical"),
      page2.descriptionOfAbuse.punchedX,
      page2.descriptionOfAbuse.punchedY,
    );
    drawCheckmark(
      page,
      font,
      formData.choking_occurred === true ||
        formData.choking_strangulation === true,
      page2.descriptionOfAbuse.chokedX,
      page2.descriptionOfAbuse.chokedY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("physical"),
      page2.descriptionOfAbuse.shovedX,
      page2.descriptionOfAbuse.shovedY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("physical"),
      page2.descriptionOfAbuse.kickedX,
      page2.descriptionOfAbuse.kickedY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("stalking"),
      page2.descriptionOfAbuse.stalkedX,
      page2.descriptionOfAbuse.stalkedY,
    );
    drawCheckmark(
      page,
      font,
      formData.pregnancy_abuse === true ||
        formData.abuse_while_pregnant === true,
      page2.descriptionOfAbuse
        .physicallyAbusedPregnantX,
      page2.descriptionOfAbuse
        .physicallyAbusedPregnantY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("threats"),
      page2.descriptionOfAbuse
        .threatenedWithHarmX,
      page2.descriptionOfAbuse
        .threatenedWithHarmY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("threats"),
      page2.descriptionOfAbuse.threatenedLifeX,
      page2.descriptionOfAbuse.threatenedLifeY,
    );
    drawCheckmark(
      page,
      font,
      formData.gun_threats === true,
      page2.descriptionOfAbuse.threatenedWeaponX,
      page2.descriptionOfAbuse.threatenedWeaponY,
    );
    drawCheckmark(
      page,
      font,
      abuseTypes.has("sexual"),
      page2.descriptionOfAbuse.sexuallyAbusedX,
      page2.descriptionOfAbuse.sexuallyAbusedY,
    );
  }
}

function overlayPage3(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const page3 = {
    defendantAbusedOther: {
      checkboxX: 96,
      checkboxY: 885,
      textX: 150,
      textY: 885,
      maxWidth: 450,
    },
    indicators: {
      abuseIncreasingX: 96,
      abuseIncreasingY: 836,
      abuseSeverityX: 96,
      abuseSeverityY: 818,
      leftRecentlyX: 96,
      leftRecentlyY: 800,
      hasFirearmsX: 330,
      hasFirearmsY: 836,
      suicideThreatsX: 330,
      suicideThreatsY: 818,
    },
    incident: {
      dateX: 110,
      dateY: 732,
      bodyX: 92,
      bodyStartY: 712,
      bodyWidth: 430,
      bodyLineHeight: 20,
      bodyMaxLines: 10,
    },
    pastIncidents: {
      firstLineX: 165,
      continuationX: 92,
      startY: 405,
      rightX: 544,
      lineHeight: 20,
      maxLines: 8,
    },
    relief: {
      immediateDangerX: 76,
      immediateDangerY: 152,
    },
  } as const;

  const otherReliefText = textOrEmpty(
    formData.relief_other,
  );
  const hasOtherRelief =
    otherReliefText.length > 0;
  drawCheckmark(
    page,
    font,
    hasOtherRelief,
    page3.defendantAbusedOther.checkboxX,
    page3.defendantAbusedOther.checkboxY,
  );
  drawFieldTextWithin(
    page,
    font,
    otherReliefText,
    page3.defendantAbusedOther.textX,
    page3.defendantAbusedOther.textY,
    page3.defendantAbusedOther.maxWidth,
    9,
  );

  drawCheckmark(
    page,
    font,
    formData.abuse_increasing,
    page3.indicators.abuseIncreasingX,
    page3.indicators.abuseIncreasingY,
  );

  drawCheckmark(
    page,
    font,
    formData.abuse_severity,
    page3.indicators.abuseSeverityX,
    page3.indicators.abuseSeverityY,
  );

  drawCheckmark(
    page,
    font,
    formData.left_recently,
    page3.indicators.leftRecentlyX,
    page3.indicators.leftRecentlyY,
  );

  drawCheckmark(
    page,
    font,
    formData.abuser_has_guns,
    page3.indicators.hasFirearmsX,
    page3.indicators.hasFirearmsY,
  );

  drawCheckmark(
    page,
    font,
    formData.suicide_threats,
    page3.indicators.suicideThreatsX,
    page3.indicators.suicideThreatsY,
  );

  drawFieldText(
    page,
    font,
    formatDateForCourt(
      formData.recent_incident_date,
    ),
    page3.incident.dateX,
    page3.incident.dateY,
  );

  const incident = textOrEmpty(
    formData.recent_incident_description,
  );
  if (incident) {
    const lines = wrapText(
      incident,
      font,
      9,
      page3.incident.bodyWidth,
    );
    let y = page3.incident.bodyStartY;
    for (const line of lines.slice(
      0,
      page3.incident.bodyMaxLines,
    )) {
      drawFieldText(
        page,
        font,
        line,
        page3.incident.bodyX,
        y,
        9,
      );
      y -= page3.incident.bodyLineHeight;
    }
  }

  drawParagraphWithFirstLineIndent(
    page,
    font,
    formData.past_incidents,
    page3.pastIncidents,
  );

  drawCheckmark(
    page,
    font,
    formData.immediate_danger,
    page3.relief.immediateDangerX,
    page3.relief.immediateDangerY,
  );
}

function overlayPage4(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const fillAll = isFillAllTestMode(formData);
  const page4 = {
    checkboxes: {
      prohibitContactCheckboxX: 76,
      prohibitContactCheckboxY: 885,
      stayAwayFromResidenceCheckboxX: 76,
      stayAwayFromResidenceCheckboxY: 835,
      stayAwayFromWorkOrSchoolCheckboxX: 76,
      stayAwayFromWorkOrSchoolCheckboxY: 767,
      protectBelongingsCheckboxX: 76,
      protectBelongingsCheckboxY: 672,
      exclusiveUseResidenceCheckboxX: 76,
      exclusiveUseResidenceCheckboxY: 623,
    },
    stayAwayResidenceAddress: {
      streetX: 110,
      streetY: 800,
      cityX: 320,
      cityY: 800,
      stateX: 452,
      stateY: 800,
      zipX: 520,
      zipY: 800,
    },
    stayAwayWorkSchoolRows: {
      row1: {
        nameX: 110,
        nameY: 732,
        addressX: 245,
        addressY: 732,
        cityX: 367,
        cityY: 732,
        stateX: 455,
        stateY: 732,
        zipX: 520,
        zipY: 732,
      },
      row2: {
        nameX: 110,
        nameY: 701,
        addressX: 245,
        addressY: 701,
        cityX: 367,
        cityY: 701,
        stateX: 455,
        stateY: 701,
        zipX: 520,
        zipY: 701,
      },
    },
    exclusiveUseResidenceAddress: {
      streetX: 115,
      streetY: 598,
      aptX: 168,
      aptY: 598,
      cityX: 320,
      cityY: 598,
      stateX: 452,
      stateY: 598,
      zipX: 520,
      zipY: 598,
      sheriffsOfficeNameX: 306,
      sheriffsOfficeNameY: 552,
      ownershipJointlyOwnedCheckboxX: 118,
      ownershipJointlyOwnedCheckboxY: 514,
      ownershipJointlyLeasedCheckboxX: 118,
      ownershipJointlyLeasedCheckboxY: 502,
      ownershipDefendantSoleLeaseCheckboxX: 118,
      ownershipDefendantSoleLeaseCheckboxY: 489,
      ownershipPetitionerSoleCheckboxX: 118,
      ownershipPetitionerSoleCheckboxY: 477,
      presentlyOccupiedByTextX: 206,
      presentlyOccupiedByTextY: 455,
      presentlyOccupiedByMaxWidth: 240,
    },
  } as const;

  const homeAddress = parseAddressParts(
    formData.home_address_for_order,
  );
  const petitionerAddress: AddressParts = {
    street:
      textOrEmpty(
        formData.current_address_street,
      ) || homeAddress.street,
    apt:
      textOrEmpty(formData.current_address_apt) ||
      homeAddress.apt,
    city:
      textOrEmpty(
        formData.current_address_city,
      ) || homeAddress.city,
    state:
      textOrEmpty(
        formData.current_address_state,
      ) || homeAddress.state,
    zip:
      textOrEmpty(formData.current_address_zip) ||
      homeAddress.zip,
  };

  const workParts = parseAddressParts(
    formData.work_address,
  );
  const schoolParts = parseAddressParts(
    formData.school_address,
  );

  const row1 =
    formData.stay_away_work === true
      ? {
          name: "Employment/Work",
          address: workParts.street,
          city: workParts.city,
          state: workParts.state,
          zip: workParts.zip,
        }
      : formData.stay_away_school === true
        ? {
            name: "School",
            address: schoolParts.street,
            city: schoolParts.city,
            state: schoolParts.state,
            zip: schoolParts.zip,
          }
        : {
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
          };
  const row2 =
    formData.stay_away_work === true &&
    formData.stay_away_school === true
      ? {
          name: "School",
          address: schoolParts.street,
          city: schoolParts.city,
          state: schoolParts.state,
          zip: schoolParts.zip,
        }
      : {
          name: "",
          address: "",
          city: "",
          state: "",
          zip: "",
        };

  drawCheckmark(
    page,
    font,
    formData.request_no_contact === true,
    page4.checkboxes.prohibitContactCheckboxX,
    page4.checkboxes.prohibitContactCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    formData.stay_away_home === true ||
      formData.request_stay_away === true,
    page4.checkboxes
      .stayAwayFromResidenceCheckboxX,
    page4.checkboxes
      .stayAwayFromResidenceCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    formData.stay_away_work === true ||
      formData.stay_away_school === true,
    page4.checkboxes
      .stayAwayFromWorkOrSchoolCheckboxX,
    page4.checkboxes
      .stayAwayFromWorkOrSchoolCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    formData.protect_property === true ||
      formData.protect_belongings === true,
    page4.checkboxes.protectBelongingsCheckboxX,
    page4.checkboxes.protectBelongingsCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    formData.need_exclusive_home === true ||
      formData.request_exclusive_use === true,
    page4.checkboxes
      .exclusiveUseResidenceCheckboxX,
    page4.checkboxes
      .exclusiveUseResidenceCheckboxY,
  );

  // Page 4(c) special-case: combine street + apt to avoid overlap in this row only.
  const residenceStreetWithApt = [
    petitionerAddress.street,
    petitionerAddress.apt,
  ]
    .filter(Boolean)
    .join(" ");
  drawFieldTextWithin(
    page,
    font,
    residenceStreetWithApt,
    page4.stayAwayResidenceAddress.streetX,
    page4.stayAwayResidenceAddress.streetY,
    page4.stayAwayResidenceAddress.cityX -
      page4.stayAwayResidenceAddress.streetX -
      10,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.city,
    page4.stayAwayResidenceAddress.cityX,
    page4.stayAwayResidenceAddress.cityY,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.state,
    page4.stayAwayResidenceAddress.stateX,
    page4.stayAwayResidenceAddress.stateY,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.zip,
    page4.stayAwayResidenceAddress.zipX,
    page4.stayAwayResidenceAddress.zipY,
    9,
  );

  drawFieldText(
    page,
    font,
    row1.name,
    page4.stayAwayWorkSchoolRows.row1.nameX,
    page4.stayAwayWorkSchoolRows.row1.nameY,
    9,
  );
  drawFieldText(
    page,
    font,
    row1.address,
    page4.stayAwayWorkSchoolRows.row1.addressX,
    page4.stayAwayWorkSchoolRows.row1.addressY,
    9,
  );
  drawFieldText(
    page,
    font,
    row1.city,
    page4.stayAwayWorkSchoolRows.row1.cityX,
    page4.stayAwayWorkSchoolRows.row1.cityY,
    9,
  );
  drawFieldText(
    page,
    font,
    row1.state,
    page4.stayAwayWorkSchoolRows.row1.stateX,
    page4.stayAwayWorkSchoolRows.row1.stateY,
    9,
  );
  drawFieldText(
    page,
    font,
    row1.zip,
    page4.stayAwayWorkSchoolRows.row1.zipX,
    page4.stayAwayWorkSchoolRows.row1.zipY,
    9,
  );
  drawFieldText(
    page,
    font,
    row2.name,
    page4.stayAwayWorkSchoolRows.row2.nameX,
    page4.stayAwayWorkSchoolRows.row2.nameY,
    9,
  );
  drawFieldText(
    page,
    font,
    row2.address,
    page4.stayAwayWorkSchoolRows.row2.addressX,
    page4.stayAwayWorkSchoolRows.row2.addressY,
    9,
  );
  drawFieldText(
    page,
    font,
    row2.city,
    page4.stayAwayWorkSchoolRows.row2.cityX,
    page4.stayAwayWorkSchoolRows.row2.cityY,
    9,
  );
  drawFieldText(
    page,
    font,
    row2.state,
    page4.stayAwayWorkSchoolRows.row2.stateX,
    page4.stayAwayWorkSchoolRows.row2.stateY,
    9,
  );
  drawFieldText(
    page,
    font,
    row2.zip,
    page4.stayAwayWorkSchoolRows.row2.zipX,
    page4.stayAwayWorkSchoolRows.row2.zipY,
    9,
  );

  // Page 4(f) special-case: combine street + apt to avoid overlap in this row only.
  const exclusiveStreetWithApt = [
    petitionerAddress.street,
    petitionerAddress.apt,
  ]
    .filter(Boolean)
    .join(" ");
  drawFieldTextWithin(
    page,
    font,
    exclusiveStreetWithApt,
    page4.exclusiveUseResidenceAddress.streetX,
    page4.exclusiveUseResidenceAddress.streetY,
    page4.exclusiveUseResidenceAddress.cityX -
      page4.exclusiveUseResidenceAddress.streetX -
      10,
    9,
  );
  drawFieldText(
    page,
    font,
    "",
    page4.exclusiveUseResidenceAddress.aptX,
    page4.exclusiveUseResidenceAddress.aptY,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.city,
    page4.exclusiveUseResidenceAddress.cityX,
    page4.exclusiveUseResidenceAddress.cityY,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.state,
    page4.exclusiveUseResidenceAddress.stateX,
    page4.exclusiveUseResidenceAddress.stateY,
    9,
  );
  drawFieldText(
    page,
    font,
    petitionerAddress.zip,
    page4.exclusiveUseResidenceAddress.zipX,
    page4.exclusiveUseResidenceAddress.zipY,
    9,
  );

  drawFieldTextWithin(
    page,
    font,
    formData.filing_parish,
    page4.exclusiveUseResidenceAddress
      .sheriffsOfficeNameX,
    page4.exclusiveUseResidenceAddress
      .sheriffsOfficeNameY,
    150,
    9,
  );

  const ownership = textOrEmpty(
    formData.home_ownership,
  ).toLowerCase();
  const jointlyOwned =
    ownership.includes("joint") &&
    ownership.includes("own");
  const jointlyLeased =
    ownership.includes("joint") &&
    ownership.includes("lease");
  const defendantSoleLease =
    ownership.includes("defendant") &&
    ownership.includes("lease");
  const petitionerSole =
    ownership.includes("petitioner") ||
    ownership.includes("solely_owned") ||
    ownership.includes("sole_owner");

  drawCheckmark(
    page,
    font,
    fillAll || jointlyOwned,
    page4.exclusiveUseResidenceAddress
      .ownershipJointlyOwnedCheckboxX,
    page4.exclusiveUseResidenceAddress
      .ownershipJointlyOwnedCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll || jointlyLeased,
    page4.exclusiveUseResidenceAddress
      .ownershipJointlyLeasedCheckboxX,
    page4.exclusiveUseResidenceAddress
      .ownershipJointlyLeasedCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll || defendantSoleLease,
    page4.exclusiveUseResidenceAddress
      .ownershipDefendantSoleLeaseCheckboxX,
    page4.exclusiveUseResidenceAddress
      .ownershipDefendantSoleLeaseCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll || petitionerSole,
    page4.exclusiveUseResidenceAddress
      .ownershipPetitionerSoleCheckboxX,
    page4.exclusiveUseResidenceAddress
      .ownershipPetitionerSoleCheckboxY,
  );

  const occupiedBy =
    formData.live_together === true
      ? "Petitioner and Defendant"
      : "Petitioner";
  drawFieldTextWithin(
    page,
    font,
    occupiedBy,
    page4.exclusiveUseResidenceAddress
      .presentlyOccupiedByTextX,
    page4.exclusiveUseResidenceAddress
      .presentlyOccupiedByTextY,
    page4.exclusiveUseResidenceAddress
      .presentlyOccupiedByMaxWidth,
    9,
  );
}

function overlayPage5(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const fillAll = isFillAllTestMode(formData);
  const page5 = {
    propertySection: {
      grantSolePropertyPossessionCheckboxX: 76,
      grantSolePropertyPossessionCheckboxY: 886,
      soleOwnedFirstLineX: 114,
      soleOwnedContinuationX: 114,
      soleOwnedStartY: 849,
      soleOwnedRightX: 544,
      soleOwnedLineHeight: 19,
      soleOwnedMaxLines: 5,
      jointlyOwnedFirstLineX: 114,
      jointlyOwnedContinuationX: 114,
      jointlyOwnedStartY: 716,
      jointlyOwnedRightX: 544,
      jointlyOwnedLineHeight: 19,
      jointlyOwnedMaxLines: 6,
      reasonsFirstLineX: 215,
      reasonsContinuationX: 114,
      reasonsStartY: 602,
      reasonsRightX: 544,
      reasonsLineHeight: 19,
      reasonsMaxLines: 3,
      sheriffsOfficeNameX: 170,
      sheriffsOfficeNameY: 545,
    },
    custodySection: {
      prohibitPropertyTransferCheckboxX: 76,
      prohibitPropertyTransferCheckboxY: 507,
      allowReturnForPersonalItemsCheckboxX: 76,
      allowReturnForPersonalItemsCheckboxY: 462,
      orderSheriffEscortForRecoveryCheckboxX: 76,
      orderSheriffEscortForRecoveryCheckboxY: 404,
      personAllowedToReturnNameX: 166,
      personAllowedToReturnNameY: 462,
      sheriffOfficeNameX: 235,
      sheriffOfficeNameY: 404,
      recoveryLocationAddressX: 215,
      recoveryLocationAddressY: 348,
      awardTemporaryCustodyCheckboxX: 76,
      awardTemporaryCustodyCheckboxY: 360,
      currentCustodyTextX: 490,
      currentCustodyTextY: 304,
      currentCustodyTextContinuationX: 110,
      currentCustodyTextRightX: 544,
      currentCustodyTextLineHeight: 37,
      currentCustodyTextMaxLines: 2,
      orderLawEnforcementRetrievalCheckboxX: 64,
      orderLawEnforcementRetrievalCheckboxY: 257,
      prohibitCustodyInterferenceCheckboxX: 64,
      prohibitCustodyInterferenceCheckboxY: 221,
      paragraph10ChildSupportCheckboxX: 64,
      paragraph10ChildSupportCheckboxY: 137,
      paragraph10SpousalSupportCheckboxX: 64,
      paragraph10SpousalSupportCheckboxY: 108,
      paragraph10CounselingProgramCheckboxX: 64,
      paragraph10CounselingProgramCheckboxY: 79,
      paragraph10CourtCostsCheckboxX: 64,
      paragraph10CourtCostsCheckboxY: 50,
    },
  } as const;

  const propertyOwnership =
    textOrEmpty(formData.home_ownership) ||
    "Residence and household property located at petitioner's current address; currently in defendant's possession.";
  const jointlyOwnedProperty =
    textOrEmpty(formData.pet_details) ||
    textOrEmpty(formData.pet_description) ||
    "Family pet and jointly used household items located at the residence.";
  const propertyReasons =
    textOrEmpty(formData.abuse_description) ||
    textOrEmpty(
      formData.recent_incident_description,
    ) ||
    "Necessary for petitioner and protected persons' safety and stability.";

  drawCheckmark(
    page,
    font,
    fillAll ||
      formData.protect_property === true ||
      formData.protect_belongings === true,
    page5.propertySection
      .grantSolePropertyPossessionCheckboxX,
    page5.propertySection
      .grantSolePropertyPossessionCheckboxY,
  );

  drawParagraphWithFirstLineIndent(
    page,
    font,
    propertyOwnership,
    {
      firstLineX:
        page5.propertySection.soleOwnedFirstLineX,
      continuationX:
        page5.propertySection
          .soleOwnedContinuationX,
      startY:
        page5.propertySection.soleOwnedStartY,
      rightX:
        page5.propertySection.soleOwnedRightX,
      lineHeight:
        page5.propertySection.soleOwnedLineHeight,
      maxLines:
        page5.propertySection.soleOwnedMaxLines,
      size: 9,
    },
  );

  drawParagraphWithFirstLineIndent(
    page,
    font,
    jointlyOwnedProperty,
    {
      firstLineX:
        page5.propertySection
          .jointlyOwnedFirstLineX,
      continuationX:
        page5.propertySection
          .jointlyOwnedContinuationX,
      startY:
        page5.propertySection.jointlyOwnedStartY,
      rightX:
        page5.propertySection.jointlyOwnedRightX,
      lineHeight:
        page5.propertySection
          .jointlyOwnedLineHeight,
      maxLines:
        page5.propertySection
          .jointlyOwnedMaxLines,
      size: 9,
    },
  );

  drawParagraphWithFirstLineIndent(
    page,
    font,
    propertyReasons,
    {
      firstLineX:
        page5.propertySection.reasonsFirstLineX,
      continuationX:
        page5.propertySection
          .reasonsContinuationX,
      startY: page5.propertySection.reasonsStartY,
      rightX: page5.propertySection.reasonsRightX,
      lineHeight:
        page5.propertySection.reasonsLineHeight,
      maxLines:
        page5.propertySection.reasonsMaxLines,
      size: 9,
    },
  );

  drawFieldTextWithin(
    page,
    font,
    formData.filing_parish,
    page5.propertySection.sheriffsOfficeNameX,
    page5.propertySection.sheriffsOfficeNameY,
    260,
    9,
  );

  const escortedPersonName =
    textOrEmpty(formData.abuser_name) ||
    (fillAll ? "TEST ESCORTED PERSON" : "");

  drawCheckmark(
    page,
    font,
    fillAll ||
      formData.protect_property === true ||
      formData.protect_belongings === true,
    page5.custodySection
      .prohibitPropertyTransferCheckboxX,
    page5.custodySection
      .prohibitPropertyTransferCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll || formData.police_escort === true,
    page5.custodySection
      .allowReturnForPersonalItemsCheckboxX,
    page5.custodySection
      .allowReturnForPersonalItemsCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll || formData.police_escort === true,
    page5.custodySection
      .orderSheriffEscortForRecoveryCheckboxX,
    page5.custodySection
      .orderSheriffEscortForRecoveryCheckboxY,
  );
  drawFieldTextWithin(
    page,
    font,
    formData.abuser_name,
    page5.custodySection
      .personAllowedToReturnNameX,
    page5.custodySection
      .personAllowedToReturnNameY,
    260,
    9,
  );
  drawFieldTextWithin(
    page,
    font,
    formData.filing_parish,
    page5.custodySection.sheriffOfficeNameX,
    page5.custodySection.sheriffOfficeNameY,
    260,
    9,
  );
  drawFieldTextWithin(
    page,
    font,
    escortedPersonName,
    page5.custodySection.recoveryLocationAddressX,
    page5.custodySection.recoveryLocationAddressY,
    280,
    9,
  );

  const tempCustodyRequested =
    formData.request_temporary_custody === true ||
    formData.request_temp_custody === true;

  drawCheckmark(
    page,
    font,
    fillAll || tempCustodyRequested,
    page5.custodySection
      .awardTemporaryCustodyCheckboxX,
    page5.custodySection
      .awardTemporaryCustodyCheckboxY,
  );

  drawParagraphWithFirstLineIndent(
    page,
    font,
    formData.children_current_location,
    {
      firstLineX:
        page5.custodySection.currentCustodyTextX,
      continuationX:
        page5.custodySection
          .currentCustodyTextContinuationX,
      startY:
        page5.custodySection.currentCustodyTextY,
      rightX:
        page5.custodySection
          .currentCustodyTextRightX,
      lineHeight:
        page5.custodySection
          .currentCustodyTextLineHeight,
      maxLines:
        page5.custodySection
          .currentCustodyTextMaxLines,
      size: 9,
    },
  );

  drawCheckmark(
    page,
    font,
    fillAll || formData.police_retrieve_children,
    page5.custodySection
      .orderLawEnforcementRetrievalCheckboxX,
    page5.custodySection
      .orderLawEnforcementRetrievalCheckboxY,
  );

  drawCheckmark(
    page,
    font,
    fillAll || formData.prevent_interference,
    page5.custodySection
      .prohibitCustodyInterferenceCheckboxX,
    page5.custodySection
      .prohibitCustodyInterferenceCheckboxY,
  );

  drawCheckmark(
    page,
    font,
    fillAll || formData.request_child_support,
    page5.custodySection
      .paragraph10ChildSupportCheckboxX,
    page5.custodySection
      .paragraph10ChildSupportCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll ||
      formData.request_spousal_support === true,
    page5.custodySection
      .paragraph10SpousalSupportCheckboxX,
    page5.custodySection
      .paragraph10SpousalSupportCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll ||
      formData.require_counseling === true,
    page5.custodySection
      .paragraph10CounselingProgramCheckboxX,
    page5.custodySection
      .paragraph10CounselingProgramCheckboxY,
  );
  drawCheckmark(
    page,
    font,
    fillAll ||
      formData.request_court_costs === true,
    page5.custodySection
      .paragraph10CourtCostsCheckboxX,
    page5.custodySection
      .paragraph10CourtCostsCheckboxY,
  );
}

function overlayPage6(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const page6 = {
    checks: {
      spousalSupportX: 66,
      spousalSupportY: 838,
      medicalCostsX: 66,
      medicalCostsY: 816,
      counselingX: 66,
      counselingY: 794,
      evaluationX: 66,
      evaluationY: 772,
      witnessCriminalHistoryX: 66,
      witnessCriminalHistoryY: 750,
      permanentOrderX: 66,
      permanentOrderY: 728,
      courtCostsX: 66,
      courtCostsY: 706,
    },
    witness: {
      witness1NameX: 120,
      witness1NameY: 650,
      witness1DobX: 360,
      witness1DobY: 650,
      witness2NameX: 120,
      witness2NameY: 628,
      witness2DobX: 360,
      witness2DobY: 628,
    },
    attorney: {
      hasAttorneyX: 66,
      hasAttorneyY: 572,
      attorneyNameX: 130,
      attorneyNameY: 548,
      attorneyBarX: 390,
      attorneyBarY: 548,
    },
  } as const;

  drawCheckmark(
    page,
    font,
    formData.request_spousal_support === true,
    page6.checks.spousalSupportX,
    page6.checks.spousalSupportY,
  );
  drawCheckmark(
    page,
    font,
    formData.request_medical_costs === true,
    page6.checks.medicalCostsX,
    page6.checks.medicalCostsY,
  );
  drawCheckmark(
    page,
    font,
    formData.require_counseling === true,
    page6.checks.counselingX,
    page6.checks.counselingY,
  );
  drawCheckmark(
    page,
    font,
    formData.require_evaluation === true,
    page6.checks.evaluationX,
    page6.checks.evaluationY,
  );
  drawCheckmark(
    page,
    font,
    formData.need_witness_criminal_check === true,
    page6.checks.witnessCriminalHistoryX,
    page6.checks.witnessCriminalHistoryY,
  );
  drawCheckmark(
    page,
    font,
    formData.want_permanent_order === true,
    page6.checks.permanentOrderX,
    page6.checks.permanentOrderY,
  );
  drawCheckmark(
    page,
    font,
    formData.request_court_costs === true,
    page6.checks.courtCostsX,
    page6.checks.courtCostsY,
  );

  const witness1 =
    formData.witnesses?.[0]?.name ||
    formData.witness_1_name;
  const witness1Dob =
    formData.witnesses?.[0]?.dateOfBirth ||
    formData.witness_1_dob;
  const witness2 = formData.witnesses?.[1]?.name;
  const witness2Dob =
    formData.witnesses?.[1]?.dateOfBirth;
  drawFieldText(
    page,
    font,
    witness1,
    page6.witness.witness1NameX,
    page6.witness.witness1NameY,
    9,
  );
  drawFieldText(
    page,
    font,
    formatDateForCourt(witness1Dob),
    page6.witness.witness1DobX,
    page6.witness.witness1DobY,
    9,
  );
  drawFieldText(
    page,
    font,
    witness2,
    page6.witness.witness2NameX,
    page6.witness.witness2NameY,
    9,
  );
  drawFieldText(
    page,
    font,
    formatDateForCourt(witness2Dob),
    page6.witness.witness2DobX,
    page6.witness.witness2DobY,
    9,
  );

  drawCheckmark(
    page,
    font,
    formData.have_attorney === true,
    page6.attorney.hasAttorneyX,
    page6.attorney.hasAttorneyY,
  );
  drawFieldText(
    page,
    font,
    formData.attorney_name,
    page6.attorney.attorneyNameX,
    page6.attorney.attorneyNameY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.attorney_bar_number,
    page6.attorney.attorneyBarX,
    page6.attorney.attorneyBarY,
    9,
  );
}

function overlayPage7(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const page7 = {
    checks: {
      hasFirearmsX: 66,
      hasFirearmsY: 870,
      gunThreatsX: 66,
      gunThreatsY: 848,
      concealedCarryX: 66,
      concealedCarryY: 826,
    },
    firearm: {
      numberOfGunsX: 250,
      numberOfGunsY: 805,
      typeX: 90,
      typeY: 760,
      detailsX: 210,
      detailsY: 760,
      locationX: 90,
      locationY: 735,
      serialX: 390,
      serialY: 735,
    },
    service: {
      addressTypeX: 120,
      addressTypeY: 680,
      addressX: 120,
      addressY: 658,
    },
  } as const;

  drawCheckmark(
    page,
    font,
    formData.abuser_has_guns === true,
    page7.checks.hasFirearmsX,
    page7.checks.hasFirearmsY,
  );
  drawCheckmark(
    page,
    font,
    formData.gun_threats === true,
    page7.checks.gunThreatsX,
    page7.checks.gunThreatsY,
  );
  drawCheckmark(
    page,
    font,
    formData.concealed_carry === true,
    page7.checks.concealedCarryX,
    page7.checks.concealedCarryY,
  );

  drawFieldText(
    page,
    font,
    String(formData.number_of_guns || ""),
    page7.firearm.numberOfGunsX,
    page7.firearm.numberOfGunsY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.gun_1_type ||
      formData.firearms?.[0]?.type,
    page7.firearm.typeX,
    page7.firearm.typeY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.gun_1_details,
    page7.firearm.detailsX,
    page7.firearm.detailsY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.gun_1_location ||
      formData.firearms?.[0]?.location,
    page7.firearm.locationX,
    page7.firearm.locationY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.firearms?.[0]?.serial,
    page7.firearm.serialX,
    page7.firearm.serialY,
    9,
  );

  drawFieldText(
    page,
    font,
    formData.service_address_type,
    page7.service.addressTypeX,
    page7.service.addressTypeY,
    9,
  );
  drawFieldTextWithin(
    page,
    font,
    formData.service_address,
    page7.service.addressX,
    page7.service.addressY,
    380,
    9,
  );
}

function overlayPage8(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const page8 = {
    signature: {
      statementTrueX: 66,
      statementTrueY: 278,
      perjuryX: 66,
      perjuryY: 256,
      petitionerNameX: 88,
      petitionerNameY: 206,
      signatureDateX: 360,
      signatureDateY: 206,
      witnessNameX: 88,
      witnessNameY: 176,
      phoneX: 360,
      phoneY: 176,
    },
  } as const;

  drawCheckmark(
    page,
    font,
    formData.statement_true === true,
    page8.signature.statementTrueX,
    page8.signature.statementTrueY,
  );
  drawCheckmark(
    page,
    font,
    formData.understand_perjury === true,
    page8.signature.perjuryX,
    page8.signature.perjuryY,
  );

  drawFieldText(
    page,
    font,
    formData.petitioner_full_name ||
      formData.full_name,
    page8.signature.petitionerNameX,
    page8.signature.petitionerNameY,
    9,
  );
  drawFieldText(
    page,
    font,
    formatDateForCourt(formData.signature_date),
    page8.signature.signatureDateX,
    page8.signature.signatureDateY,
    9,
  );
  drawFieldText(
    page,
    font,
    formData.witness_name,
    page8.signature.witnessNameX,
    page8.signature.witnessNameY,
    9,
  );
  drawFieldText(
    page,
    font,
    "",
    page8.signature.phoneX,
    page8.signature.phoneY,
    9,
  );
}

function overlayPage9(
  page: PDFPage,
  font: PDFFont,
  formData: MasterFormData,
): void {
  const page9 = {
    addendum: {
      headingX: 72,
      headingY: 900,
      abuseDescriptionX: 72,
      abuseDescriptionY: 868,
      abuseDescriptionWidth: 470,
      abuseDescriptionLineHeight: 14,
      abuseDescriptionMaxLines: 10,
      pastIncidentsFirstX: 150,
      pastIncidentsContinuationX: 72,
      pastIncidentsStartY: 700,
      pastIncidentsRightX: 544,
      pastIncidentsLineHeight: 14,
      pastIncidentsMaxLines: 16,
    },
  } as const;

  // Addendum page scaffold: this lets us exercise long-form text alignment.
  drawFieldText(
    page,
    font,
    "Addendum Details",
    page9.addendum.headingX,
    page9.addendum.headingY,
    10,
  );

  const abuseDescription = textOrEmpty(
    formData.abuse_description,
  );
  if (abuseDescription) {
    const lines = wrapText(
      abuseDescription,
      font,
      9,
      page9.addendum.abuseDescriptionWidth,
    );
    let y = page9.addendum.abuseDescriptionY;
    for (const line of lines.slice(
      0,
      page9.addendum.abuseDescriptionMaxLines,
    )) {
      drawFieldText(
        page,
        font,
        line,
        page9.addendum.abuseDescriptionX,
        y,
        9,
      );
      y -=
        page9.addendum.abuseDescriptionLineHeight;
    }
  }

  drawParagraphWithFirstLineIndent(
    page,
    font,
    formData.past_incidents,
    {
      firstLineX:
        page9.addendum.pastIncidentsFirstX,
      continuationX:
        page9.addendum.pastIncidentsContinuationX,
      startY: page9.addendum.pastIncidentsStartY,
      rightX: page9.addendum.pastIncidentsRightX,
      lineHeight:
        page9.addendum.pastIncidentsLineHeight,
      maxLines:
        page9.addendum.pastIncidentsMaxLines,
      size: 9,
    },
  );
}

async function generateTemplateBasedLPORC(
  formData: MasterFormData,
  templateBytes?: ArrayBuffer | Uint8Array,
): Promise<Uint8Array> {
  let bytes = templateBytes;
  if (!bytes) {
    const response = await fetch(
      "/templates/Lpor_C.pdf",
      { cache: "no-store" },
    );
    if (!response.ok) {
      throw new Error(
        `Template load failed: ${response.status}`,
      );
    }
    bytes = await response.arrayBuffer();
  }

  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(
    StandardFonts.Helvetica,
  );
  const pages = doc.getPages();

  // Overlay only fields we can map reliably from existing intake data.
  if (pages[0])
    overlayPage1(pages[0], font, formData);
  if (pages[1])
    overlayPage2(pages[1], font, formData);
  if (pages[2])
    overlayPage3(pages[2], font, formData);
  if (pages[3])
    overlayPage4(pages[3], font, formData);
  if (pages[4])
    overlayPage5(pages[4], font, formData);
  if (pages[5])
    overlayPage6(pages[5], font, formData);
  if (pages[6])
    overlayPage7(pages[6], font, formData);
  if (pages[7])
    overlayPage8(pages[7], font, formData);
  if (pages[8])
    overlayPage9(pages[8], font, formData);

  return await doc.save();
}

async function generateFallbackLPORC(
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

  page.drawText("LPOR-C TEMPLATE NOT AVAILABLE", {
    x: 64,
    y: 930,
    size: 16,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    "This fallback PDF confirms data collection but does not match court formatting.",
    {
      x: 64,
      y: 905,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    },
  );

  const lines = [
    `Petitioner: ${formData.petitioner_full_name || formData.full_name || ""}`,
    `Defendant: ${formData.abuser_name || ""}`,
    `Children count: ${(formData.children || []).length}`,
    `Temporary custody requested: ${String(formData.request_temporary_custody || formData.request_temp_custody || false)}`,
    `Current child location: ${formData.children_current_location || ""}`,
  ];

  let y = 860;
  for (const line of lines) {
    page.drawText(line, {
      x: 64,
      y,
      size: 11,
      font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  }

  return await doc.save();
}

export async function generateLPORCPDF(
  formData: MasterFormData,
  options?: {
    templateBytes?: ArrayBuffer | Uint8Array;
  },
): Promise<Uint8Array> {
  try {
    return await generateTemplateBasedLPORC(
      formData,
      options?.templateBytes,
    );
  } catch {
    return await generateFallbackLPORC(formData);
  }
}
