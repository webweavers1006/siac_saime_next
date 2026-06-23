import { caseComplaintReadRepository } from "../repositories/case-complaint.read.repository";

export async function fetchComplaintByCaseId(caseId) {
  try {
    const result = await caseComplaintReadRepository.findByCaseId(caseId);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Error al cargar la denuncia." };
  }
}
