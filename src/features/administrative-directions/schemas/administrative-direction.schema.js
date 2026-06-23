import { z } from "zod";

export const administrativeDirectionSchema = z.object({
  id: z.any().optional(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  isAudit: z.boolean().optional(),
  caseAreaId: z.any().optional(),
  allowedAreaIds: z.array(z.any()).optional(),
});
