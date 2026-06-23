"use server";

import { revalidatePath } from "next/cache";
import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import { getSession } from "@/features/auth/lib/auth";
import { CASE_FOLLOW_UP_CONFIG } from "../config/case-follow-up.constants";
import { caseFollowUpSchema } from "../schemas/case-follow-up.schema";
import { createCaseFollowUp, deleteCaseFollowUp } from "../services/case-follow-up.write.service";

/**
 * Creates a follow-up. Auto-fills userId from session.
 */
export const saveCaseFollowUpAction = createProtectedAction(
  () => CASE_FOLLOW_UP_CONFIG.PERMISSIONS.WRITE,
  caseFollowUpSchema,
  async (data) => {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, error: "Sesión inválida." };
    }

    const result = await createCaseFollowUp({
      ...data,
      userId: session.id,
    });

    if (result.success) {
      revalidatePath("/admin/casos");
    }
    return result;
  }
);

/**
 * Soft-deletes a follow-up.
 */
export const deleteCaseFollowUpAction = createProtectedFunction(
  CASE_FOLLOW_UP_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    const result = await deleteCaseFollowUp(id);
    if (result.success) {
      revalidatePath("/admin/casos");
    }
    return result;
  }
);
