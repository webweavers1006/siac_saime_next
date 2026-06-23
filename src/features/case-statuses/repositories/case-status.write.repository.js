import prisma from "@/features/shared/lib/prisma";
import { caseStatusMapper } from "../mappers/case-status.mapper";

export const caseStatusWriteRepository = {
  async create(data) {
    const persistence = caseStatusMapper.toPersistence(data);
    const item = await prisma.caseStatus.create({ data: persistence });
    return caseStatusMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseStatusMapper.toPersistence(data);
    const item = await prisma.caseStatus.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseStatusMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.caseStatus.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
