import prisma from "@/features/shared/lib/prisma";
import { caseComplaintMapper } from "../mappers/case-complaint.mapper";

export const caseComplaintReadRepository = {
  /**
   * Finds the complaint for a given case.
   * Returns the first active complaint or null.
   */
  async findByCaseId(caseId) {
    const item = await prisma.caseComplaint.findFirst({
      where: { caseId: Number(caseId), deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
    return caseComplaintMapper.toDomain(item);
  },
};
