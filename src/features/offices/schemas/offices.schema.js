import { z } from "zod";

export const officeSchema = z.object({
  id: z.any().optional(),
  name: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  code: z.string()
    .max(10, "El código no puede exceder los 10 caracteres")
    .nullable()
    .optional(),
  address: z.string()
    .max(500, "La dirección no puede exceder los 500 caracteres")
    .nullable()
    .optional(),
  stateId: z.number().int().positive().nullable().optional(),
  chiefName: z.string()
    .max(255, "El nombre del jefe no puede exceder los 255 caracteres")
    .nullable()
    .optional(),
  chiefIdCard: z.string()
    .max(20, "La cédula no puede exceder los 20 caracteres")
    .nullable()
    .optional(),
  chiefPhone: z.string()
    .max(100, "El teléfono no puede exceder los 100 caracteres")
    .nullable()
    .optional(),
  chiefEmail: z.string()
    .email("Email inválido")
    .max(255, "El email no puede exceder los 255 caracteres")
    .nullable()
    .optional()
    .or(z.literal("")),
  hasEmailChange: z.boolean().optional().default(false),
  hasForeignAffairs: z.boolean().optional().default(false),
  hasMigration: z.boolean().optional().default(false),
  enableQrTicket: z.boolean().optional().default(false),
  observation: z.string()
    .max(500, "La observación no puede exceder los 500 caracteres")
    .nullable()
    .optional(),
  isActive: z.boolean().optional().default(true),
});
