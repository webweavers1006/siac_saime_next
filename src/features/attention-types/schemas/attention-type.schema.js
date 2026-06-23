import { z } from "zod";

export const attentionTypeSchema = z.object({
  id: z.any().optional(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  showCaseArea: z.boolean().optional(),
  showParticipants: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
  showPopularOrg: z.boolean().optional(),
  showCoordinates: z.boolean().optional(),
  showDocuments: z.boolean().optional(),
  showPuntoCuenta: z.boolean().optional(),
});
