import prisma from "@/features/shared/lib/prisma";
import { officeMapper } from "../mappers/offices.mapper";

export const officeWriteRepository = {
  async create(data) {
    const persistence = officeMapper.toPersistence(data);
    const item = await prisma.office.create({
      data: persistence,
      include: { state: { select: { name: true } } },
    });
    return officeMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = officeMapper.toPersistence(data);
    const item = await prisma.office.update({
      where: { id: Number(id) },
      data: persistence,
      include: { state: { select: { name: true } } },
    });
    return officeMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.office.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
