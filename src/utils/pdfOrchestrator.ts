/**
 * PDF Orchestrator
 *
 * Coordinates generation of multiple PDF forms based on user selections.
 * Determines which forms are required and generates them in proper sequence.
 */

import type { MasterFormData } from "../types/generated";
import { generateLPORFPDF } from "../forms/lpor_f/pdfGenerator";
import type { LPORFFormData } from "../forms/lpor_f/formTypes";
import { generateLPORBPDF } from "../forms/lpor_b/pdfGenerator";
import { generateLPORCPDF } from "../forms/lpor_c/pdfGenerator";
import { generateLPORGPDF } from "../forms/lpor_g/pdfGenerator";
import { generateLPORBRPDF } from "../forms/lpor_br/pdfGenerator";
export type FormType =
  | "B"
  | "C"
  | "F"
  | "G"
  | "B-R";

/**
 * Transform MasterFormData to LPORFFormData structure
 */
function transformToLPORFFormData(
  formData: MasterFormData,
): LPORFFormData {
  const petitionerFullName =
    formData.petitioner_full_name ||
    formData.full_name ||
    "";

  // Split full name into first, middle, last
  const nameParts = petitionerFullName
    .trim()
    .split(/\s+/);
  const firstName = nameParts[0] || "";
  const lastName =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1]
      : "";
  const maidenMiddleName =
    nameParts.length > 2
      ? nameParts.slice(1, -1).join(" ")
      : "";

  const abuserFullName =
    formData.abuser_name || "";
  const minorChildren =
    formData.children?.map((child) => ({
      id: child.id,
      name: child.name,
      dateOfBirth: child.dateOfBirth,
      relationshipToPetitioner:
        child.relationshipToPetitioner,
    })) || [];
  const allegedIncompetent =
    formData.incompetent_persons?.map(
      (person) => ({
        id: person.id,
        name: person.name,
        dateOfBirth: person.dateOfBirth,
        relationshipToPetitioner:
          person.relationshipToPetitioner,
      }),
    ) || [];
  const sameAddressForAll =
    formData.children_same_address || false;
  const sharedStreet =
    formData.current_address_street || "";
  const sharedApt =
    formData.current_address_apt;
  const sharedCity =
    formData.current_address_city || "";
  const sharedState =
    formData.current_address_state || "";
  const sharedZip =
    formData.current_address_zip || "";

  return {
    courtName: undefined,
    docketNumber: undefined,
    division: undefined,
    filedDate: undefined,
    clerk: undefined,
    parishCity:
      formData.filing_parish ||
      formData.abuser_parish,

    filingPurpose: {
      forPetitioner: true, // If keep_address_private is true, it's for petitioner
      forMinorChildren:
        formData.have_children || false,
      forAllegedIncompetent:
        formData.protecting_incompetent || false,
    },

    petitioner: {
      firstName,
      maidenMiddleName,
      lastName,
      dateOfBirth:
        formData.petitioner_birth_date ||
        formData.birth_date ||
        "",
      race: "",
      address: {
        street:
          formData.current_address_street || "",
        aptNumber: formData.current_address_apt,
        city: formData.current_address_city || "",
        state:
          formData.current_address_state || "",
        zipCode:
          formData.current_address_zip || "",
      },
      socialSecurityNumber: undefined,
      driversLicense: undefined,
      phoneNumber: undefined,
      email: undefined,
    },

    minorChildren,
    allegedIncompetent,
    sameAddressForAll,
    minorChildrenAddress: {
      street: sameAddressForAll
        ? sharedStreet
        : "",
      aptNumber: sameAddressForAll
        ? sharedApt
        : undefined,
      city: sameAddressForAll
        ? sharedCity
        : "",
      state: sameAddressForAll
        ? sharedState
        : "",
      zipCode: sameAddressForAll
        ? sharedZip
        : "",
    },

    defendant: {
      fullName: abuserFullName,
      parentGuardianName:
        formData.parent_guardian_name,
      alias: undefined,
      race: "",
      address: {
        street:
          formData.abuser_address_street || "",
        aptNumber: formData.abuser_address_apt,
        city: formData.abuser_address_city || "",
        state:
          formData.abuser_address_state || "",
        zipCode:
          formData.abuser_address_zip || "",
      },
      socialSecurityNumber: undefined,
      driversLicense: undefined,
      phoneNumber: undefined,
      email: undefined,
    },
  };
}

export interface PDFGenerationResult {
  formType: FormType;
  fileName: string;
  pdfData: Uint8Array;
  success: boolean;
  error?: string;
}

export interface PDFPackage {
  forms: PDFGenerationResult[];
  timestamp: Date;
  totalForms: number;
  successCount: number;
  failureCount: number;
}

/**
 * Determine which forms need to be generated based on form data
 */
export function determineRequiredForms(
  formData: MasterFormData,
): FormType[] {
  const forms: FormType[] = [];

  // Form B: Main Petition for Protection from Abuse
  // Always required - this is the primary petition form
  forms.push("B");

  // Form F: Confidential Address Form
  // Required if petitioner wants to keep address private
  if (formData.keep_address_private) {
    forms.push("F");
  }

  // Form C: Request for Child Custody
  // Required if petitioner has children and is requesting custody
  if (
    formData.have_children &&
    formData.request_temporary_custody
  ) {
    forms.push("C");
  }

  // Form G: Request for Temporary Restraining Order
  // Required if petitioner is requesting immediate protection before hearing
  // This is typically always generated for domestic violence cases
  forms.push("G");

  // Form B-R: Request for Rule to Show Cause (Contempt)
  // Only generated for supplemental filings where defendant violated existing order
  if (formData.filing_type === "supplemental") {
    forms.push("B-R");
  }

  return forms;
}

/**
 * Generate a single PDF form
 */
async function generateSingleForm(
  formType: FormType,
  formData: MasterFormData,
): Promise<PDFGenerationResult> {
  try {
    let pdfData: Uint8Array;
    let fileName: string;

    switch (formType) {
      case "B":
        pdfData =
          await generateLPORBPDF(formData);
        fileName = `LPOR-B_Petition_${Date.now()}.pdf`;
        break;

      case "C":
        pdfData =
          await generateLPORCPDF(formData);
        fileName = `LPOR-C_Child_Custody_${Date.now()}.pdf`;
        break;

      case "F":
        pdfData = await generateLPORFPDF(
          transformToLPORFFormData(formData),
        );
        fileName = `LPOR-F_Confidential_Address_${Date.now()}.pdf`;
        break;

      case "G":
        pdfData =
          await generateLPORGPDF(formData);
        fileName = `LPOR-G_Temporary_Restraining_Order_${Date.now()}.pdf`;
        break;

      case "B-R":
        pdfData =
          await generateLPORBRPDF(formData);
        fileName = `LPOR-BR_Rule_to_Show_Cause_${Date.now()}.pdf`;
        break;

      default:
        throw new Error(
          `Unknown form type: ${formType}`,
        );
    }

    return {
      formType,
      fileName,
      pdfData,
      success: true,
    };
  } catch (error) {
    return {
      formType,
      fileName: `LPOR-${formType}_ERROR.pdf`,
      pdfData: new Uint8Array(),
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };
  }
}

/**
 * Generate all required PDF forms
 */
export async function generatePDFPackage(
  formData: MasterFormData,
  onProgress?: (
    current: number,
    total: number,
    formType: FormType,
  ) => void,
): Promise<PDFPackage> {
  const requiredForms =
    determineRequiredForms(formData);
  const results: PDFGenerationResult[] = [];

  let current = 0;
  const total = requiredForms.length;

  for (const formType of requiredForms) {
    current++;

    if (onProgress) {
      onProgress(current, total, formType);
    }

    const result = await generateSingleForm(
      formType,
      formData,
    );
    results.push(result);
  }

  const successCount = results.filter(
    (r) => r.success,
  ).length;
  const failureCount = results.filter(
    (r) => !r.success,
  ).length;

  return {
    forms: results,
    timestamp: new Date(),
    totalForms: total,
    successCount,
    failureCount,
  };
}

/**
 * Download a single PDF file
 */
export function downloadPDF(
  fileName: string,
  pdfData: Uint8Array,
): void {
  const blob = new Blob(
    [pdfData.buffer as ArrayBuffer],
    { type: "application/pdf" },
  );
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  // Cleanup
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download all PDFs as a zip file
 */
export async function downloadAllPDFs(
  pdfPackage: PDFPackage,
): Promise<void> {
  // For now, download each PDF individually
  // TODO: Implement zip file creation using a library like JSZip

  for (const result of pdfPackage.forms) {
    if (result.success) {
      downloadPDF(
        result.fileName,
        result.pdfData,
      );
      // Small delay between downloads to prevent browser issues
      await new Promise((resolve) =>
        setTimeout(resolve, 200),
      );
    }
  }
}

/**
 * Get human-readable form name
 */
export function getFormName(
  formType: FormType,
): string {
  const names: Record<FormType, string> = {
    B: "Petition for Protection from Abuse",
    C: "Request for Child Custody",
    F: "Confidential Address Form",
    G: "Request for Temporary Restraining Order",
    "B-R":
      "Request for Rule to Show Cause (Contempt)",
  };

  return names[formType] || formType;
}

/**
 * Get form description
 */
export function getFormDescription(
  formType: FormType,
): string {
  const descriptions: Record<FormType, string> = {
    B: "Main petition requesting court protection from an abuser",
    C: "Request for temporary custody of minor children",
    F: "Keeps your address confidential from the defendant",
    G: "Request for immediate temporary restraining order before hearing",
    "B-R":
      "Request to hold defendant in contempt for violating existing order",
  };

  return descriptions[formType] || "";
}
