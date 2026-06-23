
import { caseReadRepository } from "../repositories/case.read.repository";
import { findUserById } from "@/features/users/repositories/user.read.repository";
import { verifyPermission } from "@/features/permissions/services/permission.authorization.service";
import { getSession } from "@/features/auth/lib/auth";
import { logger } from "@/features/shared/lib/logger";

/**
 * Resolves the read scope for the current user's session.
 *
 * Returns:
 *   { type: 'all' } → user has cases:read_all permission (admin / supervisión)
 *   { type: 'scoped', userId, administrativeDirectionId } → filtered to own cases + forwarded
 *   { type: 'none' } → no valid session (should not happen behind checkPageAccess)
 */
async function resolveCaseReadScope() {
  const session = await getSession();
  if (!session?.id || !session?.role) {
    return { type: 'none' };
  }

  // Admin / users with read_all see everything
  const hasAllAccess = await verifyPermission(session.role, 'cases:read_all');
  if (hasAllAccess) {
    return { type: 'all' };
  }

  // Scoped user: get their direction from the DB
  const user = await findUserById(session.id);
  return {
    type: 'scoped',
    userId: session.id,
    administrativeDirectionId: user?.administrativeDirectionId ?? null,
  };
}

export async function fetchCasesList(params) {
  try {
    const scope = await resolveCaseReadScope();
    return await caseReadRepository.findMany({ ...params, scope });
  } catch (error) {
    logger.error("Failed to fetch cases list", { error: error.message });
    throw new Error("No se pudo obtener la lista de casos.");
  }
}

export async function fetchCaseById(id) {
  try {
    if (!id) throw new Error("ID requerido");
    return await caseReadRepository.findById(id);
  } catch (error) {
    logger.error("Failed to fetch case by id", { error: error.message, caseId: id });
    throw new Error("No se pudo obtener el caso.");
  }
}

/**
 * Returns the logged-in operator's case defaults for pre-filling the form.
 * - defaultAreaId: the direction's default area
 * - attentionChannelId: the operator's default channel
 */
export async function fetchOperatorCaseDefaults() {
  const session = await getSession();
  if (!session?.id) return null;

  const operator = await findUserById(session.id);
  if (!operator) return null;

  return {
    attentionChannelId: operator.attentionChannelId ?? null,
    defaultAreaId: operator.administrativeDirection?.caseAreaId ?? operator.caseAreaId ?? null,
  };
}

/**
 * Returns only the areas allowed for the current operator's direction.
 * Filtering is server-side — no client-side closures or useMemo tricks needed.
 * Used by the case form's area dropdown.
 */
export async function fetchOperatorAllowedAreas(searchTerm = "") {
  try {
    const session = await getSession();
    if (!session?.id) {
      logger.warn("fetchOperatorAllowedAreas: no session");
      return [];
    }

    const operator = await findUserById(session.id);
    if (!operator) {
      logger.warn("fetchOperatorAllowedAreas: operator not found", { userId: session.id });
      return [];
    }

    const areas = operator?.administrativeDirection?.allowedAreas || [];

    if (!areas.length) {
      logger.warn("fetchOperatorAllowedAreas: no allowedAreas", {
        userId: session.id,
        directionId: operator?.administrativeDirectionId,
        hasDirection: !!operator?.administrativeDirection,
      });
      return [];
    }

    const lower = (searchTerm || "").toLowerCase();
    const filtered = lower
      ? areas.filter(a => a.areaName?.toLowerCase().includes(lower))
      : areas;

    return filtered.map(a => ({ label: a.areaName, value: a.areaId }));
  } catch (error) {
    logger.error("fetchOperatorAllowedAreas error", { error: error.message });
    return [];
  }
}
