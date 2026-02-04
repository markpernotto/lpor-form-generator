#!/usr/bin/env node
/**
 * Type Generation Script
 *
 * Reads the schema CSV and generates TypeScript interfaces for form data.
 * This replaces the temporary MasterFormData interface with proper typed fields.
 *
 * Usage: node scripts/generateTypes.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.resolve(
  __dirname,
  "../../LA Bar Domestic Abuse Questions - Schema.csv",
);
const OUTPUT_PATH = path.resolve(
  __dirname,
  "../src/types/generated.ts",
);

// Field type mappings from CSV to TypeScript
const TYPE_MAPPING = {
  text: "string",
  date: "string",
  number: "number",
  boolean: "boolean",
  radio: "string",
  checkbox: "string[]",
  dropdown: "string",
  textarea: "string",
  email: "string",
  phone: "string",
  address: "string",
};

// Parse CSV line (handles quoted fields with commas)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(
    filePath,
    "utf-8",
  );
  const lines = content
    .split("\n")
    .filter((line) => line.trim());

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });

    rows.push(row);
  }

  return rows;
}

// Extract field name from plain_language_question
function extractFieldName(row) {
  // Use the category column for field name (clean snake_case names)
  const category = row.category;
  if (
    category &&
    category !== "null" &&
    category.trim()
  ) {
    return category.trim();
  }

  // Fallback: Use section + sanitized question
  const section = row.section || "unknown";
  const question =
    row.plain_language_question || "";
  const sanitized = question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 4) // Take first 4 words
    .join("_");

  return `${section}_${sanitized}`;
}

// Determine TypeScript type from CSV field_type
function getTypeScriptType(
  fieldType,
  validationRules,
) {
  // Extract base type (before colon if present)
  const baseType = fieldType.split(":")[0];
  const tsType =
    TYPE_MAPPING[baseType] || "string";

  // Check if field is optional
  const isOptional =
    validationRules &&
    !validationRules.includes("required");

  return isOptional
    ? `${tsType} | undefined`
    : tsType;
}

// Generate interface
function generateInterface(rows) {
  const fields = new Map(); // Use Map to avoid duplicates

  rows.forEach((row) => {
    const fieldName = extractFieldName(row);
    const fieldType = row.field_type || "text";
    const validationRules =
      row.validation_rules || "";
    const tsType = getTypeScriptType(
      fieldType,
      validationRules,
    );
    const helpText =
      row.help_text ||
      row.plain_language_question ||
      "";

    // Skip if already exists (prefer first occurrence)
    if (!fields.has(fieldName)) {
      fields.set(fieldName, {
        name: fieldName,
        type: tsType,
        comment: helpText.substring(0, 100), // Limit comment length
        section: row.section,
      });
    }
  });

  // Group by section
  const sections = new Map();
  fields.forEach((field) => {
    const section = field.section || "other";
    if (!sections.has(section)) {
      sections.set(section, []);
    }
    sections.get(section).push(field);
  });

  // Generate interface string
  let output = `/**
 * Generated Form Data Types
 * 
 * Auto-generated from schema CSV. DO NOT EDIT MANUALLY.
 * Run \`npm run generate:types\` to regenerate.
 * 
 * Generated: ${new Date().toISOString()}
 */

export interface PersonEntry {
  id: string;
  name: string;
  dateOfBirth: string;
  relationshipToPetitioner: string;
}

export interface MasterFormData {\n`;

  // Add fields by section
  sections.forEach((fields, sectionName) => {
    output += `  // ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} section\n`;

    fields.forEach((field) => {
      if (field.comment) {
        output += `  /** ${field.comment} */\n`;
      }
      output += `  ${field.name}?: ${field.type};\n`;
    });

    output += "\n";
  });

  // Add array-based fields that UI uses (not in CSV schema)
  output += `  // Array-based collections (used by UI components)\n`;
  output += `  /** Array of children needing protection */\n`;
  output += `  children?: PersonEntry[];\n`;
  output += `  /** Array of incompetent persons needing protection */\n`;
  output += `  incompetent_persons?: PersonEntry[];\n`;
  output += `  /** Array of witnesses */\n`;
  output += `  witnesses?: PersonEntry[];\n`;
  output += `  /** Array of firearms */\n`;
  output += `  firearms?: Array<{ type: string; location: string; serial?: string }>;\n`;
  output += `  /** Detailed description of abuse incidents */\n`;
  output += `  abuse_description?: string;\n`;
  output += `  /** Temporary custody request */\n`;
  output += `  request_temporary_custody?: boolean;\n`;
  output += `  \n`;
  output += `  // Legacy field names (for backwards compatibility with existing sections)\n`;
  output += `  petitioner_full_name?: string;\n`;
  output += `  petitioner_birth_date?: string;\n`;
  output += `  petitioner_louisiana_resident?: boolean;\n`;
  output += `  venue_reasons?: string[];\n`;
  output += `  relief_requested?: string[];\n`;
  output += `  relief_other?: string;\n`;
  output += `  choking_strangulation?: boolean;\n`;
  output += `  abuse_while_pregnant?: boolean;\n`;
  output += `  disability_accommodations?: boolean;\n`;
  output += `  have_child_together?: boolean;\n`;
  output += `  pending_divorce?: boolean;\n`;
  output += `  divorce_parish?: string;\n`;
  output += `  pending_custody?: boolean;\n`;
  output += `  custody_parish?: string;\n`;
  output += `  custody_case_number?: string;\n`;
  output += `  shared_residence?: boolean;\n`;
  output += `  request_exclusive_use?: boolean;\n`;
  output += `  protect_belongings?: boolean;\n`;
  output += `  police_escort?: boolean;\n`;
  output += `  have_pets?: boolean;\n`;
  output += `  pet_details?: string;\n`;
  output += `  police_retrieve_children?: boolean;\n`;
  output += `  supervised_visitation?: boolean;\n`;
  output += `  number_of_witnesses?: number;\n`;
  output += `\n`;

  output += "}\n";

  return output;
}

// Main execution
try {
  console.log("🔍 Reading CSV schema...");
  const rows = parseCSV(CSV_PATH);
  console.log(
    `✓ Parsed ${rows.length} fields from schema`,
  );

  console.log(
    "🔨 Generating TypeScript interface...",
  );
  const output = generateInterface(rows);

  console.log("📝 Writing to file...");
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, output, "utf-8");

  console.log(
    `✅ Types generated successfully: ${OUTPUT_PATH}`,
  );
  console.log(
    `   ${rows.length} fields processed`,
  );
} catch (error) {
  console.error(
    "❌ Error generating types:",
    error.message,
  );
  process.exit(1);
}
