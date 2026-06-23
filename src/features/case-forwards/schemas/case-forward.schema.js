import { z } from "zod";

export const caseForwardSchema = z.object({
  id: z.any().optional(),
  caseId: z.number({ required_error: "El caso es requerido" }).int().positive(),
  administrativeDirectionId: z.number({ required_error: "La dirección administrativa es requerida" }).int().positive(),
  description: z.string().max(512, "Máximo 512 caracteres").optional().or(z.literal("")),
  date: z.string().min(1, "La fecha es requerida"),
});
