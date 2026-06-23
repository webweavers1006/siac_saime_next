import { z } from "zod";

export const caseCoordinateSchema = z.object({
  id: z.any().optional(),
  caseId: z.number({ required_error: "El caso es requerido" }).int().positive(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres")
    .optional()
    .or(z.literal("")),
  latitude: z.number({ required_error: "La latitud es requerida" })
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida"),
  longitude: z.number({ required_error: "La longitud es requerida" })
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida"),
});
