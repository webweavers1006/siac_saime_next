import prisma from "@/features/shared/lib/prisma";
import { caseForwardMapper } from "../mappers/case-forward.mapper";

export const caseForwardWriteRepository = {
  async create(data) {
    const persistence = caseForwardMapper.toPersistence(data);
    const item = await prisma.caseForward.create({ data: persistence });
    return caseForwardMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseForwardMapper.toPersistence(data);
    const item = await prisma.caseForward.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseForwardMapper.toDomain(item);
  },

  /**
   * Marks all active forwards for a case as inactive (vigencia = false).
   * Used before creating a new forward to ensure only one is active.
   */
  async deactivatePreviousForwards(caseId, tx = prisma) {
    return await tx.caseForward.updateMany({
      where: { caseId: Number(caseId), isActive: true, deletedAt: null },
      data: { isActive: false },
    });
  },

  async softDelete(id) {
    return await prisma.caseForward.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
