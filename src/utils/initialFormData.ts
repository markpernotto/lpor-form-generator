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

  const parishCity = getQueryParam("parishCity");
  if (parishCity) {
    initialData.parishCity = parishCity;
  }

  const division = getQueryParam("division");
  if (division) {
    initialData.division = division;
  }

  // Support both 'number' and 'docket' for backward compatibility
  const number = getQueryParam("number");
  const docket = getQueryParam("docket");
  if (number) {
    initialData.docketNumber = number;
  } else if (docket) {
    initialData.docketNumber = docket;
  }

  // Support both 'filed' and 'filed_date' for backward compatibility
  const filed = getQueryParam("filed");
  const filedDate = getQueryParam("filed_date");
  if (filed) {
    initialData.filedDate = filed; // Expected format: YYYY-MM-DD
  } else if (filedDate) {
    initialData.filedDate = filedDate;
  }

  const clerk = getQueryParam("clerk");
  if (clerk) {
    initialData.clerk = clerk;
  }

  return initialData;
}

/**
 * Examples of query parameter usage for LPOR F Court Information:
 *
 * Basic court info:
 * ?court=Caddo%20Parish%20Court&number=2024-12345&division=A
 *
 * With filed date and clerk:
 * ?court=Orleans%20Parish&parishCity=New%20Orleans&number=2024-CV-001&division=B&filed=2024-10-14&clerk=John%20Doe
 *
 * Full example:
 * ?court=Jefferson%20Parish%20Court&parishCity=Jefferson&number=2024-CV-001&division=B&filed=2024-10-14&clerk=Jane%20Smith
 *
 * With debug mode to show test data button:
 * ?court=Jefferson%20Parish%20Court&number=2024-CV-001&debug=true
 *
 * Note:
 * - Spaces in values should be URL encoded as %20
 * - Filed date should be in YYYY-MM-DD format
 * - Only court information fields are pre-populated
 * - Users will still fill in petitioner, defendant, and violation details
 * - Backward compatibility: 'docket' and 'filed_date' params still work
 */
