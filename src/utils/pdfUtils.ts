/**
 * Shared PDF Drawing Utilities
 *
 * Reusable functions for drawing common PDF elements across all form generators.
 * Uses pdf-lib for programmatic PDF generation.
 */

import type {
  PDFPage,
  PDFFont,
  RGB,
} from "pdf-lib";
import { rgb } from "pdf-lib";

// Common colors
export const COLORS = {
  black: rgb(0, 0, 0),
  gray: rgb(0.5, 0.5, 0.5),
  lightGray: rgb(0.8, 0.8, 0.8),
  white: rgb(1, 1, 1),
} as const;

// Common sizes
export const SIZES = {
  letterWidth: 612,
  letterHeight: 1008, // US Legal height (14")
  marginLeft: 50,
  marginRight: 562,
  marginTop: 958,
  marginBottom: 50,
} as const;

export interface TextOptions {
  x: number;
  y: number;
  size?: number;
  font?: PDFFont;
  color?: RGB;
  maxWidth?: number;
  lineHeight?: number;
}

export interface CheckboxOptions {
  x: number;
  y: number;
  size?: number;
  checked: boolean;
  label?: string;
  labelOffset?: number;
  font?: PDFFont;
  fontSize?: number;
}

export interface TableColumn {
  header: string;
  width: number;
  key: string;
}

export interface TableOptions {
  x: number;
  y: number;
  columns: TableColumn[];
  data: Record<string, unknown>[];
  headerFont?: PDFFont;
  bodyFont?: PDFFont;
  headerSize?: number;
  bodySize?: number;
  rowHeight?: number;
  borderColor?: RGB;
}

/**
 * Draw text with automatic word wrapping
 */
export function drawText(
  page: PDFPage,
  text: string,
  options: TextOptions,
): number {
  const {
    x,
    y,
    size = 10,
    font,
    color = COLORS.black,
    maxWidth = SIZES.marginRight - x,
    lineHeight = size * 1.2,
  } = options;

  if (!font) {
    throw new Error(
      "Font is required for drawText",
    );
  }

  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  // Word wrap
  for (const word of words) {
    const testLine = currentLine
      ? `${currentLine} ${word}`
      : word;
    const width = font.widthOfTextAtSize(
      testLine,
      size,
    );

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw each line
  let currentY = y;
  for (const line of lines) {
    page.drawText(line, {
      x,
      y: currentY,
      size,
      font,
      color,
    });
    currentY -= lineHeight;
  }

  // Return final Y position
  return currentY;
}

/**
 * Draw a checkbox with optional label
 */
export function drawCheckbox(
  page: PDFPage,
  options: CheckboxOptions,
): void {
  const {
    x,
    y,
    size = 12,
    checked,
    label,
    labelOffset = 20,
    font,
    fontSize = 10,
  } = options;

  // Draw checkbox square
  page.drawRectangle({
    x,
    y: y - size,
    width: size,
    height: size,
    borderColor: COLORS.black,
    borderWidth: 1,
  });

  // Draw check mark if checked
  if (checked) {
    page.drawText("X", {
      x: x + 2,
      y: y - size + 2,
      size: size - 2,
      font,
      color: COLORS.black,
    });
  }

  // Draw label if provided
  if (label && font) {
    page.drawText(label, {
      x: x + labelOffset,
      y: y - size + 2,
      size: fontSize,
      font,
      color: COLORS.black,
    });
  }
}

/**
 * Draw a simple table
 */
export function drawTable(
  page: PDFPage,
  options: TableOptions,
): number {
  const {
    x,
    y,
    columns,
    data,
    headerFont,
    bodyFont,
    headerSize = 10,
    bodySize = 9,
    rowHeight = 20,
    borderColor = COLORS.black,
  } = options;

  if (!headerFont || !bodyFont) {
    throw new Error(
      "Both headerFont and bodyFont are required for drawTable",
    );
  }

  let currentY = y;

  // Draw header
  let currentX = x;
  for (const column of columns) {
    // Header cell border
    page.drawRectangle({
      x: currentX,
      y: currentY - rowHeight,
      width: column.width,
      height: rowHeight,
      borderColor,
      borderWidth: 1,
    });

    // Header text
    page.drawText(column.header, {
      x: currentX + 5,
      y: currentY - rowHeight + 5,
      size: headerSize,
      font: headerFont,
      color: COLORS.black,
    });

    currentX += column.width;
  }

  currentY -= rowHeight;

  // Draw data rows
  for (const row of data) {
    currentX = x;

    for (const column of columns) {
      // Cell border
      page.drawRectangle({
        x: currentX,
        y: currentY - rowHeight,
        width: column.width,
        height: rowHeight,
        borderColor,
        borderWidth: 1,
      });

      // Cell text
      const value = String(row[column.key] || "");
      page.drawText(value, {
        x: currentX + 5,
        y: currentY - rowHeight + 5,
        size: bodySize,
        font: bodyFont,
        color: COLORS.black,
      });

      currentX += column.width;
    }

    currentY -= rowHeight;
  }

  return currentY;
}

/**
 * Draw form field label and value
 */
export function drawField(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  font: PDFFont,
  boldFont: PDFFont,
  labelSize: number = 9,
  valueSize: number = 10,
): number {
  // Draw label
  page.drawText(label, {
    x,
    y,
    size: labelSize,
    font: boldFont,
    color: COLORS.black,
  });

  // Draw value below label
  const valueY = y - labelSize * 1.5;
  page.drawText(value || "(not provided)", {
    x,
    y: valueY,
    size: valueSize,
    font,
    color: COLORS.black,
  });

  // Return next Y position
  return valueY - valueSize * 1.5;
}

/**
 * Draw a horizontal line (divider)
 */
export function drawLine(
  page: PDFPage,
  x1: number,
  y: number,
  x2: number,
  color: RGB = COLORS.lightGray,
  thickness: number = 1,
): void {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    color,
    thickness,
  });
}

/**
 * Draw page header with title
 */
export function drawPageHeader(
  page: PDFPage,
  title: string,
  subtitle: string | undefined,
  font: PDFFont,
  boldFont: PDFFont,
): number {
  let y = SIZES.marginTop;

  // Title
  page.drawText(title, {
    x: SIZES.marginLeft,
    y,
    size: 14,
    font: boldFont,
    color: COLORS.black,
  });

  y -= 20;

  // Subtitle if provided
  if (subtitle) {
    page.drawText(subtitle, {
      x: SIZES.marginLeft,
      y,
      size: 10,
      font,
      color: COLORS.black,
    });
    y -= 15;
  }

  // Divider line
  drawLine(
    page,
    SIZES.marginLeft,
    y,
    SIZES.marginRight,
  );
  y -= 20;

  return y;
}

/**
 * Draw page footer with page number
 */
export function drawPageFooter(
  page: PDFPage,
  pageNumber: number,
  totalPages: number,
  font: PDFFont,
): void {
  const text = `Page ${pageNumber} of ${totalPages}`;
  const textWidth = font.widthOfTextAtSize(
    text,
    9,
  );
  const x = (SIZES.letterWidth - textWidth) / 2;

  page.drawText(text, {
    x,
    y: SIZES.marginBottom - 20,
    size: 9,
    font,
    color: COLORS.black,
  });
}

/**
 * Format date from ISO string to MM/DD/YYYY
 */
export function formatDate(
  dateString: string | undefined,
): string {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    const month = String(
      date.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(date.getDate()).padStart(
      2,
      "0",
    );
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Format phone number to (XXX) XXX-XXXX
 */
export function formatPhone(
  phone: string | undefined,
): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
