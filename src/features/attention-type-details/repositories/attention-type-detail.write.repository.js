import prisma from "@/features/shared/lib/prisma";
import { attentionTypeDetailMapper } from "../mappers/attention-type-detail.mapper";

export const attentionTypeDetailWriteRepository = {
  async create(data) {
    const persistence = attentionTypeDetailMapper.toPersistence(data);
    const item = await prisma.attentionTypeDetail.create({ data: persistence });
    return attentionTypeDetailMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = attentionTypeDetailMapper.toPersistence(data);
    const item = await prisma.attentionTypeDetail.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return attentionTypeDetailMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.attentionTypeDetail.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
