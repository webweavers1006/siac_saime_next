"use server";

import { revalidatePath } from "next/cache";
import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import { getSession } from "@/features/auth/lib/auth";
import { CASE_FORWARD_CONFIG } from "../config/case-forward.constants";
import { caseForwardSchema } from "../schemas/case-forward.schema";
import { createCaseForward, deleteCaseForward } from "../services/case-forward.write.service";

/**
 * Creates a forward (remisión). Auto-fills userId from session.
 * Deactivates any previous active forward for the same case.
 */
export const saveCaseForwardAction = createProtectedAction(
  () => CASE_FORWARD_CONFIG.PERMISSIONS.WRITE,
  caseForwardSchema,
  async (data) => {
    const session = await getSession();
    if (!session?.id) {
      return { success: false, error: "Sesión inválida." };
    }

    const result = await createCaseForward({
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
 * Soft-deletes a forward.
 */
export const deleteCaseForwardAction = createProtectedFunction(
  CASE_FORWARD_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    const result = await deleteCaseForward(id);
    if (result.success) {
      revalidatePath("/admin/casos");
    }
    return result;
  }
);
