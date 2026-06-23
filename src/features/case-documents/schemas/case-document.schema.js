import { z } from "zod";
import { FILE_ALLOWED_EXTENSIONS } from "@/features/shared/lib/file-validation";

/**
 * Schema for the CaseDocument DB record (not the file itself).
 * File validation is done in the storage service before reaching this schema.
 */
export const caseDocumentSchema = z.object({
  id: z.any().optional(),
  caseId: z.any().optional(),
  filePath: z.string().min(1, "La ruta del archivo es requerida"),
  description: z.string()
    .max(500, "La descripción no puede exceder los 500 caracteres")
    .optional()
    .or(z.literal("")),
  originalName: z.string()
    .max(255, "El nombre original no puede exceder los 255 caracteres")
    .optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  extension: z.string()
    .refine((ext) => FILE_ALLOWED_EXTENSIONS.includes(ext?.toLowerCase()), {
      message: "Extensión no permitida",
    })
    .optional(),
});
