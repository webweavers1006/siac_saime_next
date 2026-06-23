import { z } from "zod";

export const caseFollowUpSchema = z.object({
  id: z.any().optional(),
  caseId: z.number({ required_error: "El caso es requerido" }).int().positive(),
  callStatusId: z.number({ required_error: "El estatus de llamada es requerido" }).int().positive(),
  comment: z.string().max(512, "Máximo 512 caracteres").optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es requerida"),
  time: z.string().min(1, "La hora es requerida"),
});
