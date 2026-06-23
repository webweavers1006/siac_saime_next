"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { fetchTicketsList, fetchTicketById } from "../services/ticket.read.service";

export const getTicketsListAction = createProtectedFunction(
  TICKET_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchTicketsList(params);
  }
);

export const getTicketByIdAction = createProtectedFunction(
  TICKET_CONFIG.PERMISSIONS.READ,
  async (id) => {
    return fetchTicketById(id);
  }
);
