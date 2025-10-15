import type { LPORFFormData } from "../forms/lpor_f/formTypes";
import { getQueryParam } from "./queryParams";

/**
 * Create initial LPOR F form data with Court Information values from URL query parameters
 * Only pre-populates court-related fields that won't require user input
 * Query parameters are NOT URL decoded to preserve encoding for PDF generation
 */
export function createInitialLPORFData(): Partial<LPORFFormData> {
  const initialData: Partial<LPORFFormData> = {};

  // Court Information fields that can be pre-populated
  const court = getQueryParam("court");
  if (court) {
    initialData.courtName = court; // Keep encoded (e.g., "Caddo%20Parish%20Court")
  }

  const docket = getQueryParam("docket");
  if (docket) {
    initialData.docketNumber = docket;
  }

  const division = getQueryParam("division");
  if (division) {
    initialData.division = division;
  }

  const filedDate = getQueryParam("filed_date");
  if (filedDate) {
    initialData.filedDate = filedDate; // Expected format: YYYY-MM-DD
  }

  return initialData;
}

/**
 * Examples of query parameter usage for LPOR F Court Information:
 *
 * Basic court info:
 * ?court=Caddo%20Parish%20Court&docket=2024-12345&division=A
 *
 * With filed date:
 * ?court=Orleans%20Parish&docket=2024-CV-001&division=B&filed_date=2024-10-14
 *
 * Full example:
 * ?court=Jefferson%20Parish%20Court&docket=2024-CV-001&division=B&filed_date=2024-10-14
 *
 * Note:
 * - Spaces in court names should be URL encoded as %20
 * - Filed date should be in YYYY-MM-DD format
 * - Only court information fields are pre-populated
 * - Users will still fill in petitioner, defendant, and violation details
 */
