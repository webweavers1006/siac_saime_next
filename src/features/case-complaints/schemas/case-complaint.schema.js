import { z } from "zod";

/**
 * Schema for a single complaint — matches the form fields embedded in the case form.
 * caseId is injected by the action, not validated from the form.
 */
export const caseComplaintSchema = z.object({
  caseId: z.number({ required_error: "El caso es requerido" }).int().positive(),
  affectsPerson: z.boolean().optional(),
  affectsCommunity: z.boolean().optional(),
  affectsThirdParties: z.boolean().optional(),
  involvedParties: z.string().optional().or(z.literal("")),
  incidentDate: z.string().optional().or(z.literal("")),
  popularInstance: z.string().optional().or(z.literal("")),
  instanceRif: z.string().optional().or(z.literal("")),
  financingEntity: z.string().optional().or(z.literal("")),
  projectName: z.string().optional().or(z.literal("")),
  approvedAmount: z.string().optional().or(z.literal("")),
});
