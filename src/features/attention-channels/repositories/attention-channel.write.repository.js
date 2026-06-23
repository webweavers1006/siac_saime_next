import prisma from "@/features/shared/lib/prisma";
import { attentionChannelMapper } from "../mappers/attention-channel.mapper";

export const attentionChannelWriteRepository = {
  async create(data) {
    const persistence = attentionChannelMapper.toPersistence(data);
    const item = await prisma.attentionChannel.create({ data: persistence });
    return attentionChannelMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = attentionChannelMapper.toPersistence(data);
    const item = await prisma.attentionChannel.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return attentionChannelMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.attentionChannel.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
