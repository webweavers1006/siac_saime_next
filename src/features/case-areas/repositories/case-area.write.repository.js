import prisma from "@/features/shared/lib/prisma";
import { caseAreaMapper } from "../mappers/case-area.mapper";

export const caseAreaWriteRepository = {
  async create(data) {
    const persistence = caseAreaMapper.toPersistence(data);
    const item = await prisma.caseArea.create({ data: persistence });
    return caseAreaMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseAreaMapper.toPersistence(data);
    const item = await prisma.caseArea.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseAreaMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.caseArea.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
