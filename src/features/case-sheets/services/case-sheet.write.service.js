/**
 * case-sheet.write.service.js
 * PDF generation orchestration for case planillas.
 * Selects the correct template based on attention type and renders the PDF.
 *
 * Uses jsPDF server-side. All templates share the base layout (cintillo + footer).
 */

import { jsPDF } from "jspdf";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";
import { buildGenericSheet } from "../templates/sheet-generic";
import { buildAsesoriaSheet } from "../templates/sheet-asesoria";
import { buildDenunciaSheet } from "../templates/sheet-denuncia";
import { logger } from "@/features/shared";

const { PAGE, COLORS, CINTILLO } = CASE_SHEET_CONFIG;

/**
 * Creates a fresh jsPDF document with standard config (letter, portrait, margins).
 * @returns {jsPDF}
 */
function createDocument() {
  const doc = new jsPDF({
    orientation: PAGE.ORIENTATION === "portrait" ? "p" : "l",
    unit: PAGE.UNIT,
    format: PAGE.FORMAT,
  });
  doc.setFont("helvetica"); // jsPDF expects lowercase font names
  return doc;
}

/**
 * Loads the cintillo image as base64 data URI.
 * Cached in module scope.
 * @returns {string|null} Base64 data URI or null if image not found
 */
let _cintilloBase64 = null;
function getCintilloBase64() {
  if (_cintilloBase64 !== null) return _cintilloBase64;

  try {
    const cintilloPath = resolve(process.cwd(), CINTILLO.PATH);
    if (!existsSync(cintilloPath)) {
      logger.warn("Cintillo image not found", { path: cintilloPath });
      _cintilloBase64 = "";
      return _cintilloBase64;
    }
    const buffer = readFileSync(cintilloPath);
    const base64 = buffer.toString("base64");
    _cintilloBase64 = `data:image/jpeg;base64,${base64}`;
    return _cintilloBase64;
  } catch (error) {
    logger.error("Failed to load cintillo image", { error: error.message });
    _cintilloBase64 = "";
    return _cintilloBase64;
  }
}

/**
 * Adds the SAIME cintillo header image to the document.
 * @param {jsPDF} doc
 */
function addCintillo(doc) {
  const base64 = getCintilloBase64();
  if (!base64) return;
  doc.addImage(base64, CINTILLO.FORMAT, CINTILLO.X, CINTILLO.Y, CINTILLO.WIDTH, CINTILLO.HEIGHT);
}

/**
 * Adds the institutional footer to the document.
 * Matches legacy Footer_Planilla() from FPDF.
 * @param {jsPDF} doc
 */
function addFooter(doc) {
  const { FOOTER } = CASE_SHEET_CONFIG.UI.LABELS;
  const pageHeight = doc.internal.pageSize.height;
  const footerY = pageHeight - 30;

  // Divider line
  doc.setDrawColor(...COLORS.DIVIDER_GRAY);
  doc.line(10, footerY, 200, footerY);

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.LIGHT_GRAY);
  doc.text(FOOTER.LINE1, 105, footerY + 5, { align: "center" });
  doc.text(FOOTER.LINE2, 105, footerY + 9, { align: "center" });
  doc.text(FOOTER.LINE3, 105, footerY + 13, { align: "center" });

  // Website in SAIME blue
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(FOOTER.WEB, 105, footerY + 18, { align: "center" });
}

/**
 * Renders the full planilla PDF for a single case.
 * @param {object} sheetData - Template-ready data from mapper
 * @returns {Buffer} PDF buffer
 */
export function generateSheetBuffer(sheetData) {
  const doc = createDocument();
  const template = sheetData.template;

  // 1. Cintillo SAIME
  addCintillo(doc);

  // 2. Body — delegate to specific template
  switch (template) {
    case "asesoria":
      buildAsesoriaSheet(doc, sheetData);
      break;
    case "denuncia":
      buildDenunciaSheet(doc, sheetData);
      break;
    default:
      buildGenericSheet(doc, sheetData);
      break;
  }

  // 3. Footer institucional
  addFooter(doc);

  // 4. Return as Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

/**
 * Generates planilla PDF buffers for multiple cases (batch).
 *
 * @param {object[]} sheetDataList - Array of template-ready data objects
 * @returns {{ caseId: number, buffer: Buffer, filename: string }[]}
 */
export function generateBatchSheetBuffers(sheetDataList) {
  return sheetDataList.map((data) => {
    const buffer = generateSheetBuffer(data);
    const safeName = (data.requestNumber || `caso-${data.caseId}`).replace(/[^a-zA-Z0-9_-]/g, "_");
    return {
      caseId: data.caseId,
      buffer,
      filename: `planilla_${safeName}.pdf`,
    };
  });
}
