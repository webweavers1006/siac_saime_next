"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import { getSession } from "@/features/auth/lib/auth";
import { createRateLimiter } from "@/features/shared/lib/rate-limiter";
import {
  createTicket,
  callNextTicket,
  updateTicketStatus,
  cancelTicket,
} from "../services/ticket.write.service";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { createTicketSchema, updateTicketStatusSchema, callNextSchema } from "../schemas/ticket.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

// ── Rate limiter for public ticket creation (QR page) ──────────────────

const publicTicketLimiter = createRateLimiter({
  maxAttempts: TICKET_CONFIG.RATE_LIMIT.PUBLIC_TICKET.MAX_ATTEMPTS,
  windowMs: TICKET_CONFIG.RATE_LIMIT.PUBLIC_TICKET.WINDOW_MS,
  name: "public-ticket",
});

// ── Protected actions (admin/reception) ────────────────────────────────

export const createTicketAction = createProtectedAction(
  TICKET_CONFIG.PERMISSIONS.CREATE,
  createTicketSchema,
  async (data) => {
    try {
      const result = await createTicket(data);
      if (result.success) {
        revalidatePath(TICKET_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("createTicketAction failed", { error: error.message });
      return { success: false, error: "Error inesperado al generar el turno." };
    }
  }
);

export const callNextAction = createProtectedAction(
  TICKET_CONFIG.PERMISSIONS.CALL,
  callNextSchema,
  async (data) => {
    try {
      const session = await getSession();
      const result = await callNextTicket(data.officeId, session.id, data.deskNumber, data.serviceType);
      if (result.success) {
        revalidatePath(TICKET_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("callNextAction failed", { error: error.message });
      return { success: false, error: "Error inesperado al llamar el turno." };
    }
  }
);

export const updateTicketStatusAction = createProtectedAction(
  TICKET_CONFIG.PERMISSIONS.UPDATE,
  updateTicketStatusSchema,
  async (data) => {
    try {
      const session = await getSession();
      const result = await updateTicketStatus(data.id, data.status, session.id, {
        deskNumber: data.deskNumber,
      });
      if (result.success) {
        revalidatePath(TICKET_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("updateTicketStatusAction failed", { error: error.message, ticketId: data.id });
      return { success: false, error: "Error inesperado al actualizar el turno." };
    }
  }
);

export const cancelTicketAction = createProtectedFunction(
  TICKET_CONFIG.PERMISSIONS.UPDATE,
  async (id) => {
    try {
      const session = await getSession();
      const result = await cancelTicket(id, session.id);
      if (result.success) {
        revalidatePath(TICKET_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("cancelTicketAction failed", { error: error.message, ticketId: id });
      return { success: false, error: "Error inesperado al cancelar el turno." };
    }
  }
);

// ── Public action (QR auto-service, no login required) ─────────────────

/**
 * Creates a ticket from the public QR page.
 * Rate-limited by IP. No authentication required.
 */
export async function createPublicTicketAction(data) {
  try {
    // Rate limit check
    const { headers } = await import("next/headers");
    const heads = await headers();
    const ip = heads.get("x-forwarded-for") || heads.get("x-real-ip") || "unknown";
    const limitResult = publicTicketLimiter.checkLimit(ip);
    if (!limitResult.allowed) {
      return {
        success: false,
        error: "Ha excedido el límite de turnos. Intente de nuevo más tarde.",
      };
    }

    // Validate data
    const parsed = createTicketSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: "Datos inválidos.", details: parsed.error.flatten().fieldErrors };
    }

    const result = await createTicket(parsed.data);
    return result;
  } catch (error) {
    logger.error("createPublicTicketAction failed", { error: error.message });
    return { success: false, error: "Error inesperado al generar el turno." };
  }
}
