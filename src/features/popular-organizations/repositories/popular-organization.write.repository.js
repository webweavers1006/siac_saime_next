import prisma from "@/features/shared/lib/prisma";
import { popularOrganizationMapper } from "../mappers/popular-organization.mapper";

export const popularOrganizationWriteRepository = {
  async create(data) {
    const persistence = popularOrganizationMapper.toPersistence(data);
    const item = await prisma.popularOrganization.create({ data: persistence });
    return popularOrganizationMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = popularOrganizationMapper.toPersistence(data);
    const item = await prisma.popularOrganization.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return popularOrganizationMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.popularOrganization.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
