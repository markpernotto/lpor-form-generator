# LPOR Generator Agent Notes

## Privacy posture
- Keep data in memory only.
- Do not add persistence (cookies/localStorage/sessionStorage/indexedDB).
- Avoid logging PII to the browser console.
- Prefer `autocomplete=\"off\"` on sensitive forms.
- Keep emergency exit (`Panic Clear`) available and fast.

## PDF strategy
- LPOR-F is template-overlay based:
  - Template file: `public/templates/Lpor_F.pdf`
  - Overlay code: `src/forms/lpor_f/pdfGenerator.ts`
- LPOR-C now uses the official multi-page template:
  - Template file: `public/templates/Lpor_C.pdf`
  - Overlay code: `src/forms/lpor_c/pdfGenerator.ts`
- LPOR-G now uses the official template:
  - Template file: `public/templates/Lpor_G.pdf`
  - Overlay code: `src/forms/lpor_g/pdfGenerator.ts`
- Other LPOR forms are still programmatic drawing.
- US Legal page size requirement is active in shared PDF sizes:
  - `src/utils/pdfUtils.ts` (`612 x 1008`)

## Test PDF commands
- LPOR-F:
  - `npm run gen:test:lporf`
  - output: `tmp/LPOR-F_test_from_intake_flow.pdf`
- LPOR-C:
  - `npm run gen:test:lporc`
  - output: `tmp/LPOR-C_test_from_intake_flow.pdf`
- LPOR-G:
  - `npm run gen:test:lporg`
  - output: `tmp/LPOR-G_test_from_intake_flow.pdf`

## Constraints for test data
- Keep test values realistic and limited to fields users can actually enter in intake.
- Do not inject hidden/non-collectable values just to fill PDFs.
- Prefer generation through `generatePDFPackage` for intake-flow parity.

## Known mapping caveats
- Some PDF generators still read direct boolean fields that may not be fully driven by all intake sections.
- When adding/adjusting tests, verify field names against section `updateField(...)` calls.
