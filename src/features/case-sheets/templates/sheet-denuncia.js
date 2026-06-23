/**
 * sheet-denuncia.js
 * Denuncia planilla template (attentionTypeId = 5).
 *
 * Matches legacy FPDF: Header_Denuncia() + Content_Denuncia() + Footer_Planilla()
 * Includes: affectation checkboxes, involved parties, incident date, Poder Popular data.
 */

import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";

const { COLORS } = CASE_SHEET_CONFIG;
const { LABELS } = CASE_SHEET_CONFIG.UI;
const PAGE_W = 210;
const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;

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
 * Builds the Denuncia planilla sheet.
 * @param {jsPDF} doc
 * @param {object} data
 */
export function buildDenunciaSheet(doc, data) {
  let y = 38;
  const complaint = data.complaint || {};

  // --- SUBTITLE + TITLE ---
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.TITLES.SUBTITLE, PAGE_W / 2, y, { align: "center" });
  y += 6;

  doc.setFontSize(12);
  doc.text(LABELS.TITLES.DENUNCIA, PAGE_W / 2, y, { align: "center" });
  y += 10;

  // --- CONTROL ROW (inline style: N: id   FECHA: date   HORA: time) ---
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.DARK_TEXT);
  doc.text(`N: ${data.requestNumber || data.caseId}`, MARGIN, y + 4);
  doc.text(`FECHA: ${data.caseDate}`, MARGIN + 55, y + 4);
  doc.text(`HORA: ${data.caseTime}`, MARGIN + 120, y + 4);
  y += 12;

  // --- APPLICANT DATA ---
  y = sectionHeader(doc, LABELS.SECTIONS.APPLICANT_DATA, y);

  // NOMBRES + CÉDULA
  underlinedField(doc, "NOMBRES:", data.fullName, MARGIN, y, 130, 7);
  underlinedField(doc, "CEDULA:", data.idCard, MARGIN + 130, y, 60, 7);
  y += 8;

  // MUNICIPIO + PARROQUIA + TELÉFONO
  const thirdW = CONTENT_W / 3;
  underlinedField(doc, LABELS.FIELDS.MUNICIPALITY, data.municipalityName, MARGIN, y, thirdW, 7);
  underlinedField(doc, LABELS.FIELDS.PARISH, data.parishName, MARGIN + thirdW, y, thirdW, 7);
  underlinedField(doc, "TELEFONO:", data.phone, MARGIN + thirdW * 2, y, thirdW, 7);
  y += 8;

  // CORREO
  underlinedField(doc, "CORREO:", data.email, MARGIN, y, CONTENT_W, 7);
  y += 12;

  // --- SECTION 1: AFFECTS CHECKBOXES ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.SECTIONS.AFFECTS, MARGIN, y);
  y += 5;

  const affects = CASE_SHEET_CONFIG.COMPLAINT_AFFECTS;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.DARK_TEXT);

  let ax = MARGIN;
  affects.forEach((item) => {
    const checked = complaint[item.key] === true;
    doc.text(item.label, ax, y + 3);
    const textW = doc.getTextWidth(item.label);
    drawCheckbox(doc, ax + textW + 2, y, 4, checked);
    ax += 65;
  });
  y += 10;

  // --- SECTION 2: INVOLVED PARTIES ---
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.SECTIONS.INVOLVED, MARGIN, y);
  y += 4;

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.BLACK);
  const involvedText = complaint.involvedParties || "N/A";
  const involvedLines = doc.splitTextToSize(involvedText, CONTENT_W - 2);
  const involvedH = Math.max(involvedLines.length * 4 + 4, 10);
  doc.setDrawColor(...COLORS.BORDER_GRAY);
  doc.rect(MARGIN, y, CONTENT_W, involvedH);
  doc.text(involvedLines, MARGIN + 2, y + 4);
  y += involvedH + 6;

  // --- SECTION 3: INCIDENT DATE ---
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.SECTIONS.INCIDENT_DATE, MARGIN, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.BLACK);
  doc.text(complaint.incidentDate || "N/A", MARGIN + 55, y);
  y += 10;

  // --- POPULAR POWER DATA ---
  y = sectionHeader(doc, LABELS.SECTIONS.POPULAR_POWER, y);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.BLACK);
  const halfW = CONTENT_W / 2;

  // Row 1: Instancia + RIF
  doc.text(`  ${LABELS.FIELDS.INSTANCE} ${complaint.popularInstance || "N/A"}`, MARGIN, y + 4);
  doc.text(`  ${LABELS.FIELDS.RIF} ${complaint.instanceRif || "N/A"}`, MARGIN + halfW, y + 4);
  y += 6;

  // Row 2: Ente + Monto
  doc.text(`  ${LABELS.FIELDS.FINANCING_ENTITY} ${complaint.financingEntity || "N/A"}`, MARGIN, y + 4);
  doc.text(`  ${LABELS.FIELDS.APPROVED_AMOUNT} ${complaint.approvedAmount || "0.00"}`, MARGIN + halfW, y + 4);
  y += 10;

  // --- DENUNCIATION DESCRIPTION ---
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.SAIME_BLUE);
  doc.text(LABELS.SECTIONS.DENUNCIATION_DESC + ":", MARGIN, y);
  y += 3;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.BLACK);
  const descLines = doc.splitTextToSize(data.description || "", CONTENT_W - 2);
  const descH = Math.max(descLines.length * 3.5 + 4, 15);
  doc.setDrawColor(...COLORS.BORDER_GRAY);
  doc.rect(MARGIN, y, CONTENT_W, descH);
  doc.text(descLines, MARGIN + 2, y + 3);
  y += descH + 50;

  // --- SIGNATURES ---
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.DARK_TEXT);

  doc.line(MARGIN + 10, y, MARGIN + 85, y);
  doc.line(MARGIN + 115, y, MARGIN + 190, y);
  y += 4;

  doc.text("FECHA", MARGIN + 47.5, y, { align: "center" });
  doc.text("FIRMA DEL SOLICITANTE", MARGIN + 152.5, y, { align: "center" });
}
