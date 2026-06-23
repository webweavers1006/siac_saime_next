export async function validateCaseFollowUpRules(data, _excludeId = null) {
  if (!data.caseId) {
    return { success: false, error: "El caso es requerido.", details: { caseId: ["Requerido"] } };
  }
  if (!data.callStatusId) {
    return { success: false, error: "El estatus de llamada es requerido.", details: { callStatusId: ["Requerido"] } };
  }
  return { success: true };
}
