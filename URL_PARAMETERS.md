# LPOR-F URL Parameters Documentation

## Overview
The LPOR-F form supports pre-population of court information fields via URL query parameters. These fields are automatically populated when the form loads and are passed to the PDF generator without requiring user input.

## Supported URL Parameters

### Court Information Parameters

| Parameter | Maps To | Required | Description | Example |
|-----------|---------|----------|-------------|---------|
| `court` | `courtName` | No | Name of the court | `Caddo%20Parish%20Court` |
| `parishCity` | `parishCity` | No | Parish or city name | `Caddo%20Parish` or `New%20Orleans` |
| `division` | `division` | No | Court division | `A`, `B`, `C` |
| `number` | `docketNumber` | No | Docket/case number | `2024-CV-12345` |
| `filed` | `filedDate` | No | Filing date (YYYY-MM-DD format) | `2024-10-16` |
| `clerk` | `clerk` | No | Clerk name | `John%20Doe` |

### Backward Compatibility Parameters

For backward compatibility, the following alternative parameter names are also supported:

| Alternative Parameter | Preferred Parameter | Notes |
|----------------------|---------------------|-------|
| `docket` | `number` | Legacy parameter name for docket number |
| `filed_date` | `filed` | Legacy parameter name for filing date |

### Debug/Development Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `debug` | boolean | Shows the "Populate Test Data" button | `debug=true` or `debug=1` |
| `showTestData` | boolean | Alternative to debug, shows test data button | `showTestData=true` |

## PDF Generation

All court information parameters are automatically passed to the PDF generator and will appear in the generated PDF document at these locations:

- **Court Name**: Top right, above "COURT" label (line 752)
- **Parish/City**: Below "PARISH/CITY OF" label (line 737)
- **Division**: Next to "DIVISION" label (line 707)
- **Docket Number**: Next to "NUMBER" label (line 707)
- **Filed Date**: After "FILED" label (line 692)
- **Clerk Name**: After "CLERK" label (line 692)

## Example URLs

### Basic Court Information
```
/lpor-f?court=Caddo%20Parish%20Court&number=2024-12345&division=A
```

### Complete Court Information
```
/lpor-f?court=Jefferson%20Parish%20Court&parishCity=Jefferson&number=2024-CV-001&division=B&filed=2024-10-16&clerk=Jane%20Smith
```

### With Language Selection
```
/es/lpor-f?court=Orleans%20Parish&parishCity=New%20Orleans&number=2024-CV-555&division=C&filed=2024-10-16
```

### Development Mode (with test data button)
```
/lpor-f?court=Test%20Court&number=TEST-001&debug=true
```

### Using Legacy Parameters (backward compatible)
```
/lpor-f?court=Caddo%20Parish%20Court&docket=2024-12345&filed_date=2024-10-16
```

## URL Encoding

Remember to properly URL-encode parameter values:

- Spaces: `%20` (e.g., "Caddo Parish" → "Caddo%20Parish")
- Special characters should be encoded
- Dates should use YYYY-MM-DD format (no encoding needed)

## Implementation Details

### Files Modified

1. **`src/utils/initialFormData.ts`**
   - Added support for all 6 court parameters
   - Maintained backward compatibility with `docket` and `filed_date`
   - Enhanced documentation with examples

2. **`src/forms/lpor_f/pdfGenerator.ts`**
   - Added PDF text output for all court fields:
     - `parishCity` (line 73)
     - `division` (line 96)
     - `docketNumber` (line 109)
     - `filedDate` (line 122)
     - `clerk` (line 135)

3. **`src/utils/queryParams.ts`**
   - Added `isDebugMode()` function to check for debug parameters

4. **`src/forms/lpor_f/LPORFForm.tsx`**
   - Imported `isDebugMode` utility
   - Made "Populate Test Data" button conditional on debug mode

### Form Type Definition

The `LPORFFormData` interface in `src/forms/lpor_f/formTypes.ts` already includes all required fields:

```typescript
export interface LPORFFormData {
  // Court Information
  courtName?: string;
  docketNumber?: string;
  division?: string;
  filedDate?: string;
  clerk?: string;
  parishCity?: string;
  // ... other fields
}
```

## Testing

To test the URL parameter functionality:

1. **Test Basic Parameters**:
   ```
   http://localhost:5173/lpor-f?court=Test%20Court&number=123&division=A
   ```

2. **Test All Parameters**:
   ```
   http://localhost:5173/lpor-f?court=Orleans%20Parish&parishCity=New%20Orleans&number=2024-CV-001&division=B&filed=2024-10-16&clerk=Test%20Clerk
   ```

3. **Test Debug Mode**:
   ```
   http://localhost:5173/lpor-f?debug=true
   ```
   (Should show the "Populate Test Data" button)

4. **Test PDF Generation**:
   - Load form with URL parameters
   - Fill out remaining form fields
   - Submit form and check that all court information appears correctly in the generated PDF

## Notes

- Court information fields are **not** displayed in the form UI for user editing
- These fields are automatically passed to the PDF generator
- Users only fill in petitioner, defendant, and other case-specific details
- The test data button is hidden by default in production and only shown when `debug=true` or `showTestData=true` is in the URL
