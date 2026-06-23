import prisma from "@/features/shared/lib/prisma";
import { beneficiaryTypeMapper } from "../mappers/beneficiary-type.mapper";

export const beneficiaryTypeWriteRepository = {
  async create(data) {
    const persistence = beneficiaryTypeMapper.toPersistence(data);
    const item = await prisma.beneficiaryType.create({ data: persistence });
    return beneficiaryTypeMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = beneficiaryTypeMapper.toPersistence(data);
    const item = await prisma.beneficiaryType.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return beneficiaryTypeMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.beneficiaryType.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
