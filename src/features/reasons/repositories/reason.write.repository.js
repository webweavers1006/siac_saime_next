import prisma from "@/features/shared/lib/prisma";
import { reasonMapper } from "../mappers/reason.mapper";

export const reasonWriteRepository = {
  async create(data) {
    const persistence = reasonMapper.toPersistence(data);
    const item = await prisma.reason.create({ data: persistence });
    return reasonMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = reasonMapper.toPersistence(data);
    const item = await prisma.reason.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return reasonMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.reason.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
