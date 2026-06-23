import prisma from "@/features/shared/lib/prisma";
import { attentionTypeMapper } from "../mappers/attention-type.mapper";

export const attentionTypeWriteRepository = {
  async create(data) {
    const persistence = attentionTypeMapper.toPersistence(data);
    const item = await prisma.attentionType.create({ data: persistence });
    return attentionTypeMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = attentionTypeMapper.toPersistence(data);
    const item = await prisma.attentionType.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return attentionTypeMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.attentionType.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
