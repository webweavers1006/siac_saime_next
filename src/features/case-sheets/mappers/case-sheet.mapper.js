/**
 * case-sheet.mapper.js
 * Transforms raw Prisma case data into the structure expected by PDF templates.
 * All field names in English per project conventions.
 */

import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";

/**
 * Maps raw Prisma Case result → planilla template data.
 * Matches the data structure expected by legacy FPDF Header_Planilla / Content_planilla.
 *
 * @param {object} entity - Raw Prisma case with includes
 * @returns {object} Template-ready data object
 */
export function toSheetData(entity) {
  if (!entity) return null;

  const person = entity.person || {};
  const complaint = entity.caseComplaints?.[0] || {};
  const attentionTypeId = entity.attentionType?.id;
  const templateKey = CASE_SHEET_CONFIG.TEMPLATE_MAP[attentionTypeId] || CASE_SHEET_CONFIG.TEMPLATE_MAP.DEFAULT;

  // Format date as dd/mm/yyyy (matches legacy format)
  const caseDate = entity.caseDate
    ? new Date(entity.caseDate).toLocaleDateString("es-VE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  // Format time as hh:mm:ss AM/PM (matches legacy format)
  const caseTime = entity.caseTime || "";

  // Full name: firstName + lastName
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ") || "";

  // Operator name
  const operatorName = entity.user
    ? [entity.user.firstName, entity.user.lastName].filter(Boolean).join(" ")
    : "";

  return {
    template: templateKey,
    attentionTypeId,

    // Control row
    caseId: entity.id,
    requestNumber: entity.requestNumber || "",
    caseDate,
    caseTime,

    // Applicant data
    fullName,
    idCard: person.idCard || "",
    municipalityName: person.municipality?.name || "",
    parishName: person.parish?.name || "",
    phone: person.phone || "",
    email: person.email || "",

    // Attention type
    attentionTypeName: entity.attentionType?.name || "",

    // Attached entity (for asesoria)
    attachedEntityName: entity.attachedEntity?.name || "",

    // Description
    description: entity.description || "",

    // Operator (for asesoria receptor/cargo)
    operatorName,
    operatorPosition: "", // Not stored in User model; could be added later

    // Complaint data (for denuncia)
    complaint: complaint
      ? {
          affectsPerson: complaint.affectsPerson || false,
          affectsCommunity: complaint.affectsCommunity || false,
          affectsThirdParties: complaint.affectsThirdParties || false,
          involvedParties: complaint.involvedParties || "",
          incidentDate: complaint.incidentDate
            ? new Date(complaint.incidentDate).toLocaleDateString("es-VE")
            : "",
          popularInstance: complaint.popularInstance || "",
          instanceRif: complaint.instanceRif || "",
          financingEntity: complaint.financingEntity || "",
          approvedAmount: complaint.approvedAmount || "",
        }
      : null,
  };
}

/**
 * Maps a list of raw Prisma entities to template data.
 *
 * @param {object[]} entities
 * @returns {object[]}
 */
export function toSheetDataList(entities) {
  return entities.map(toSheetData).filter(Boolean);
}

/**
 * Returns a human-readable sort key for a domain field.
 *
 * @param {string} domainKey
 * @returns {string}
 */
export function toSortKey(domainKey) {
  const sortMap = {
    caseId: "id",
    requestNumber: "requestNumber",
    caseDate: "caseDate",
    fullName: "person.firstName",
    attentionTypeName: "attentionType.name",
  };
  return sortMap[domainKey] || domainKey;
}
