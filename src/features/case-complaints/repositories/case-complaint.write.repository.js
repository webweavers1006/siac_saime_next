import prisma from "@/features/shared/lib/prisma";
import { caseComplaintMapper } from "../mappers/case-complaint.mapper";

export const caseComplaintWriteRepository = {
  /**
   * Creates a new complaint record.
   */
  async create(data) {
    const persistence = caseComplaintMapper.toPersistence(data);
    const item = await prisma.caseComplaint.create({ data: persistence });
    return caseComplaintMapper.toDomain(item);
  },

  /**
   * Updates an existing complaint.
   */
  async update(id, data) {
    const persistence = caseComplaintMapper.toPersistence(data);
    const item = await prisma.caseComplaint.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseComplaintMapper.toDomain(item);
  },

  /**
   * Soft-deletes all complaints for a case (before recreating).
   */
  async softDeleteByCaseId(caseId) {
    return await prisma.caseComplaint.updateMany({
      where: { caseId: Number(caseId), deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
