import prisma from "@/features/shared/lib/prisma";
import { nowVE } from "@/features/shared/lib/date-utils";
import { caseFollowUpMapper } from "../mappers/case-follow-up.mapper";

export const caseFollowUpWriteRepository = {
  async create(data) {
    const persistence = caseFollowUpMapper.toPersistence(data);
    const item = await prisma.caseFollowUp.create({ data: persistence });
    return caseFollowUpMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseFollowUpMapper.toPersistence(data);
    const item = await prisma.caseFollowUp.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseFollowUpMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.caseFollowUp.update({
      where: { id: Number(id) },
      data: { deletedAt: nowVE() },
    });
  },
};
