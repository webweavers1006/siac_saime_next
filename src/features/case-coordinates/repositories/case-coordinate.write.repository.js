import prisma from "@/features/shared/lib/prisma";
import { caseCoordinateMapper } from "../mappers/case-coordinate.mapper";

export const caseCoordinateWriteRepository = {
  /**
   * Creates a new coordinate record.
   */
  async create(data) {
    const persistence = caseCoordinateMapper.toPersistence(data);
    const item = await prisma.caseCoordinate.create({ data: persistence });
    return caseCoordinateMapper.toDomain(item);
  },

  /**
   * Updates an existing coordinate.
   */
  async update(id, data) {
    const persistence = caseCoordinateMapper.toPersistence(data);
    const item = await prisma.caseCoordinate.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseCoordinateMapper.toDomain(item);
  },

  /**
   * Soft-deletes a coordinate.
   */
  async softDelete(id) {
    return await prisma.caseCoordinate.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Soft-deletes the coordinate for a specific case.
   * Used before upserting a new coordinate for the same case.
   */
  async softDeleteByCaseId(caseId) {
    return await prisma.caseCoordinate.updateMany({
      where: { caseId: Number(caseId), deletedAt: null },
      data: { deletedAt: new Date() },
    });
  },
};
