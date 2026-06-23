import { z } from "zod";

export const reasonSchema = z.object({
  id: z.any().optional(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  caseAreaId: z.number({ required_error: "El área es requerida" }),
});
