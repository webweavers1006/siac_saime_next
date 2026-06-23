import { currentYearVE } from "@/features/shared/lib/date-utils";
import { caseMapper } from "../mappers/case.mapper";

/**
 * Generates the next sequential request number.
 * Format: SOL-YYYY-NNNN (e.g., SOL-2026-0001)
 */
async function generateRequestNumber() {
  const currentYear = currentYearVE();
  const prefix = `SOL-${currentYear}-`;

  // Find the latest request number for the current year
  const latest = await prisma.case.findFirst({
    where: {
      requestNumber: { startsWith: prefix },
      deletedAt: null,
    },
    orderBy: { requestNumber: "desc" },
    select: { requestNumber: true },
  });

  if (!latest?.requestNumber) {
    return `${prefix}0001`;
  }

  // Extract numeric suffix and increment
  const lastNumber = parseInt(latest.requestNumber.replace(prefix, ""), 10);
  const nextNumber = String(lastNumber + 1).padStart(4, "0");
  return `${prefix}${nextNumber}`;
}

export const caseWriteRepository = {
  async create(data) {
    const persistence = caseMapper.toPersistence(data);
    persistence.requestNumber = await generateRequestNumber();
    const item = await prisma.case.create({ data: persistence });
    return caseMapper.toDomain(item);
  },

  async update(id, data) {
    const persistence = caseMapper.toPersistence(data);
    // Do NOT regenerate requestNumber on update — it stays the same
    const item = await prisma.case.update({
      where: { id: Number(id) },
      data: persistence,
    });
    return caseMapper.toDomain(item);
  },

  async softDelete(id) {
    return await prisma.case.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },
    });
  },
};
