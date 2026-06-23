import prisma from "@/features/shared/lib/prisma";
import { callStatusMapper } from "../mappers/call-status.mapper";

export const callStatusWriteRepository = {
  async create(data) {
    const persistence = callStatusMapper.toPersistence(data);
    const item = await prisma.callStatus.create({ data: persistence });
    return callStatusMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = callStatusMapper.toPersistence(data);
    const item = await prisma.callStatus.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return callStatusMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.callStatus.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
