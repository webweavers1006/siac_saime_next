"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createCase,
  updateCase,
  deleteCase,
} from "../services/case.write.service";
import { CASE_CONFIG } from "../config/case.constants";
import { caseSchema } from "../schemas/case.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";
import { findUserById } from "@/features/users/repositories/user.read.repository";
import { upsertComplaint } from "@/features/case-complaints/services/case-complaint.write.service";
import { createAuditEntry } from "@/features/audit-logs/services/audit-log.write.service";

export const saveCaseAction = createProtectedAction(
  (data) => data.id ? CASE_CONFIG.PERMISSIONS.UPDATE : CASE_CONFIG.PERMISSIONS.WRITE,
  caseSchema,
  async (data, session) => {
    try {
      const { id, complaint, ...rest } = data;

      let result;
      if (id) {
        // On update, preserve existing data — do not override
        result = await updateCase(id, rest, session.id);
      } else {
        // On create, operator is always the logged-in user
        // Pre-fill operator defaults: channel + area (from direction, validated)
        const operator = await findUserById(session.id);
        const dir = operator?.administrativeDirection;
        const allowedAreaIds = dir?.allowedAreas?.map(a => a.areaId) || [];

        // Validate: if direction has allowed areas defined, reject non-allowed ones
        const formAreaId = rest.caseAreaId ? Number(rest.caseAreaId) : null;

        if (formAreaId && allowedAreaIds.length > 0 && !allowedAreaIds.includes(formAreaId)) {
          return {
            success: false,
            error: `El área seleccionada no está permitida para tu dirección.`,
          };
        }

        const resolvedAreaId = formAreaId
          ?? dir?.caseAreaId
          ?? operator?.caseAreaId
          ?? null;

        result = await createCase({
          ...rest,
          userId: session.id,
          attentionChannelId: rest.attentionChannelId ?? operator?.attentionChannelId ?? null,
          caseAreaId: resolvedAreaId,
        });
      }

      if (result.success) {
        // Upsert complaint if complaint data was submitted
        const caseId = result.data?.id ?? id;
        if (caseId && complaint) {
          const complaintResult = await upsertComplaint(caseId, complaint);
          if (!complaintResult.success) {
            logger.error("Failed to save complaint for case", { caseId });
          }
        }

        // Audit log
        const requestNumber = result.data?.requestNumber || `#${caseId}`;
        createAuditEntry({
          userId: session.id,
          action: id
            ? `Caso ${requestNumber} actualizado`
            : `Caso ${requestNumber} creado`,
        });

        revalidatePath(CASE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save case", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deleteCaseAction = createProtectedFunction(
  CASE_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deleteCase(id);
      if (result.success) {
        revalidatePath(CASE_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete case", { error: error.message, caseId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
