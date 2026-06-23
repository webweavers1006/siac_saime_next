import prisma from "@/features/shared/lib/prisma";
import { attachedEntityMapper } from "../mappers/attached-entity.mapper";

export const attachedEntityWriteRepository = {
  async create(data) {
    const persistence = attachedEntityMapper.toPersistence(data);
    const item = await prisma.attachedEntity.create({ data: persistence });
    return attachedEntityMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = attachedEntityMapper.toPersistence(data);
    const item = await prisma.attachedEntity.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return attachedEntityMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.attachedEntity.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
