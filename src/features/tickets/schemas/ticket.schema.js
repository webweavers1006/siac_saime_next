import { z } from "zod";
import { TICKET_CONFIG } from "../config/ticket.constants";

const statusValues = Object.values(TICKET_CONFIG.STATUS);

export const createTicketSchema = z.object({
  attentionTypeId: z.number().int().positive().optional().nullable(),
  officeId: z.number().int().positive("Seleccione una oficina"),
  serviceType: z.string().max(30).optional().nullable(),
  personId: z.number().int().positive().optional().nullable(),
  personIdCard: z.string().max(20).optional().nullable(),
  personFirstName: z.string().max(255).optional().nullable(),
  personLastName: z.string().max(255).optional().nullable(),
  personPhone: z.string().max(20).optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const updateTicketStatusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(statusValues),
  deskNumber: z.string().max(10).optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
});

export const callNextSchema = z.object({
  officeId: z.number().int().positive("Seleccione una oficina"),
  deskNumber: z.string().max(10).optional().nullable(),
  serviceType: z.string().max(30).optional().nullable(),
});

export const ticketListParamsSchema = z.object({
  page: z.number().int().positive().optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
  searchTerm: z.string().optional().default(""),
  sortKey: z.string().optional().default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).optional().default("desc"),
  officeId: z.number().int().positive().optional().nullable(),
  status: z.enum(statusValues).optional().nullable(),
  attentionTypeId: z.number().int().positive().optional().nullable(),
  dateFrom: z.string().optional().nullable(),
  dateTo: z.string().optional().nullable(),
});
