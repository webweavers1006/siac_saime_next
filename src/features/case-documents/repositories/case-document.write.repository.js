import prisma from "@/features/shared/lib/prisma";
import { caseDocumentMapper } from "../mappers/case-document.mapper";
import { deleteStoredFile } from "../services/case-document.storage.service";
import { logger } from "@/features/shared/lib/logger";

export const caseDocumentWriteRepository = {
  async create(data) {
    const persistence = caseDocumentMapper.toPersistence(data);
    const item = await prisma.caseDocument.create({ data: persistence });
    return caseDocumentMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseDocumentMapper.toPersistence(data);
    const item = await prisma.caseDocument.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseDocumentMapper.toDomain(item);
  },

  /**
   * Soft-deletes a case document AND removes the physical file.
   */
  async softDelete(id) {
    const existing = await prisma.caseDocument.findFirst({
      where: { id: Number(id), deletedAt: null },
      select: { id: true, filePath: true },
    });

    if (!existing) {
      throw new Error("Documento no encontrado.");
    }

    // Soft delete in DB
    await prisma.caseDocument.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });

    // Delete physical file (fire-and-forget — errors logged but don't block)
    if (existing.filePath) {
      deleteStoredFile(existing.filePath).catch((err) => {
        logger.error("Failed to delete physical file on soft delete", {
          error: err.message,
          filePath: existing.filePath,
        });
      });
    }
  },
};
