import { z } from "zod";

export const complaintSchema = z.object({
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

export const caseSchema = z.object({
  id: z.any().optional(),
  description: z.string().optional().or(z.literal("")),
  caseDate: z.string().optional().or(z.literal("")),
  caseTime: z.string().max(20, "La hora no puede exceder 20 caracteres").optional().or(z.literal("")),
  personId: z.any().optional(),
  caseStatusId: z.any().optional(),
  caseAreaId: z.any().optional(),
  reasonId: z.any().optional(),
  attentionTypeId: z.any().optional(),
  attentionTypeDetailId: z.any().optional(),
  attentionChannelId: z.any().optional(),
  attachedEntityId: z.any().optional(),
  popularOrganizationId: z.any().optional(),
  officeId: z.any().optional(),
  complaint: complaintSchema.optional(),
});
