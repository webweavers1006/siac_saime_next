/**
 * sheet-asesoria.js
 * Asesoría planilla (attentionTypeId = 1).
 * Same layout style as denuncia. Extra: ENTE ADSCRITO field.
 *
 * Layout: Cintillo → Subtitle + Title → Control row →
 *   Applicant Data (+ ENTE ADSCRITO) → Description → Signatures → Footer
 */

import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";

const { COLORS } = CASE_SHEET_CONFIG;
const { LABELS } = CASE_SHEET_CONFIG.UI;
const PAGE_W = 210;
const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;

// ── Shared helpers (same as denuncia) ───────────────────────────

function sectionHeader(doc, text, y) {
  doc.setFillColor(...COLORS.SAIME_BLUE);
  doc.rect(MARGIN, y, CONTENT_W, 6, "F");
  doc.setTextColor(...COLORS.WHITE);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(`  ${text}`, MARGIN + 2, y + 4.5);
  return y + 8;
}

function underlinedField(doc, label, value, x, y, width, height) {
  doc.setDrawColor(...COLORS.BORDER_GRAY);
  doc.line(x, y + height, x + width, y + height);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.DARK_TEXT);
  doc.text(`  ${label}`, x, y + height - 2);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const labelW = doc.getTextWidth(`  ${label}`);
  doc.text(value || "", x + labelW + 2, y + height - 2);
}

/**
 * Builds the Asesoría planilla sheet.
 * @param {jsPDF} doc
 * @param {object} data
 */
export function buildAsesoriaSheet(doc, data) {
  let y = 38;

  // ── SUBTITLE + TITLE ──────────────────────────────────────────
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.TITLES.SUBTITLE, PAGE_W / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(14);
  doc.text(LABELS.TITLES.ASESORIA, PAGE_W / 2, y, { align: "center" });
  y += 12;

  // ── CONTROL ROW (inline style — same as denuncia) ─────────────
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.DARK_TEXT);
  doc.text(`N: ${data.requestNumber || data.caseId}`, MARGIN, y + 4);
  doc.text(`FECHA: ${data.caseDate}`, MARGIN + 55, y + 4);
  doc.text(`HORA: ${data.caseTime}`, MARGIN + 120, y + 4);
  y += 12;

  // ── APPLICANT DATA ─────────────────────────────────────────────
  y = sectionHeader(doc, LABELS.SECTIONS.APPLICANT_DATA, y);

  underlinedField(doc, "NOMBRES:", data.fullName, MARGIN, y, 130, 7);
  underlinedField(doc, "CEDULA:", data.idCard, MARGIN + 130, y, 60, 7);
  y += 8;

  const thirdW = CONTENT_W / 3;
  underlinedField(doc, LABELS.FIELDS.MUNICIPALITY, data.municipalityName, MARGIN, y, thirdW, 7);
  underlinedField(doc, LABELS.FIELDS.PARISH, data.parishName, MARGIN + thirdW, y, thirdW, 7);
  underlinedField(doc, "TELEFONO:", data.phone, MARGIN + thirdW * 2, y, thirdW, 7);
  y += 8;

  // CORREO + ENTE ADSCRITO (asesoria-specific)
  const halfW = CONTENT_W / 2;
  underlinedField(doc, "CORREO:", data.email, MARGIN, y, halfW - 2, 7);
  underlinedField(doc, "ENTE ADSCRITO:", data.attachedEntityName, MARGIN + halfW + 2, y, halfW - 2, 7);
  y += 12;

  // ── DESCRIPTION ────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text("DESCRIPCION DE LA SOLICITUD:", MARGIN, y);
  y += 4;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.BLACK);
  const lines = doc.splitTextToSize(data.description || "", CONTENT_W - 2);
  const descH = Math.max(lines.length * 4 + 4, 25);
  doc.setDrawColor(...COLORS.BORDER_GRAY);
  doc.rect(MARGIN, y, CONTENT_W, descH);
  doc.text(lines, MARGIN + 2, y + 4);
  y += descH + 55;

  // ── SIGNATURES (same style as denuncia) ────────────────────────
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.DARK_TEXT);

  doc.line(MARGIN + 10, y, MARGIN + 85, y);
  doc.line(MARGIN + 115, y, MARGIN + 190, y);
  y += 4;

  doc.text("FECHA", MARGIN + 47.5, y, { align: "center" });
  doc.text("FIRMA DEL SOLICITANTE", MARGIN + 152.5, y, { align: "center" });
}
