import prisma from "@/features/shared/lib/prisma";
import { administrativeDirectionMapper } from "../mappers/administrative-direction.mapper";

export const administrativeDirectionWriteRepository = {
  async create(data, allowedAreaIds = []) {
    const persistence = administrativeDirectionMapper.toPersistence(data);
    const item = await prisma.administrativeDirection.create({
      data: {
        ...persistence,
        directionAreas: allowedAreaIds.length > 0
          ? { create: allowedAreaIds.map(id => ({ areaId: Number(id) })) }
          : undefined,
      },
    });
    return administrativeDirectionMapper.toDomain(item);
  },

  async update(id, data, allowedAreaIds) {
    const persistence = administrativeDirectionMapper.toPersistence(data);
    const item = await prisma.administrativeDirection.update({
      where: { id: Number(id) },
      data: {
        ...persistence,
        ...(allowedAreaIds !== undefined
          ? { directionAreas: administrativeDirectionMapper.toDirectionAreasPayload(allowedAreaIds) }
          : {}),
      },
    });
    return administrativeDirectionMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.administrativeDirection.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Updates ONLY the directionAreas for a direction.
   * Does not touch any other fields.
   */
  async updateAreas(id, areaIds) {
    return await prisma.administrativeDirection.update({
      where: { id: Number(id) },
      data: {
        directionAreas: administrativeDirectionMapper.toDirectionAreasPayload(areaIds),
      },
    });
  },
};
