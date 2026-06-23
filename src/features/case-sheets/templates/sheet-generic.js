/**
 * sheet-generic.js
 * Generic planilla for Sugerencia (2), Queja (3), Reclamo (4), Petición (6).
 * Same layout style as denuncia — only differs in data shown.
 *
 * Layout: Cintillo → Title → Checkboxes (centered) → Control row →
 *   Applicant Data → Description → Signatures → Footer
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

function drawCheckbox(doc, x, y, size, checked) {
  doc.setDrawColor(...COLORS.DARK_TEXT);
  if (checked) {
    doc.setFillColor(...COLORS.DARK_TEXT);
    doc.rect(x, y, size, size, "FD");
  } else {
    doc.rect(x, y, size, size);
  }
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
 * Builds the generic planilla sheet.
 * @param {jsPDF} doc
 * @param {object} data
 */
export function buildGenericSheet(doc, data) {
  let y = 38;

  // ── TITLE ─────────────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.TITLES.GENERIC, PAGE_W / 2, y, { align: "center" });
  y += 12;

  // ── CHECKBOXES (centered, same style as denuncia afectación) ──
  const checkboxes = CASE_SHEET_CONFIG.ATTENTION_TYPE_CHECKBOXES;
  const entries = Object.entries(checkboxes);

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.DARK_TEXT);

  // Measure total real width to center properly
  const itemWidths = entries.map(([, name]) => {
    const label = `${name}:`;
    return doc.getTextWidth(label) + 4 + 4; // text + gap + checkbox(4mm) + gap
  });
  const totalRealW = itemWidths.reduce((a, b) => a + b, 0) + (entries.length - 1) * 8;
  let cx = (PAGE_W - totalRealW) / 2;

  entries.forEach(([id, name], i) => {
    const checked = Number(id) === data.attentionTypeId;
    const label = `${name}:`;
    doc.text(label, cx, y + 4);
    const textW = doc.getTextWidth(label);
    drawCheckbox(doc, cx + textW + 4, y, 4, checked);
    cx += itemWidths[i] + 8;
  });
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

  underlinedField(doc, "CORREO:", data.email, MARGIN, y, CONTENT_W, 7);
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
