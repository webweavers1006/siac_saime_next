import { z } from "zod";

export const personSchema = z.object({
  id: z.any().optional(),
  firstName: z.string()
    .min(1, "El nombre es requerido")
    .max(255, "El nombre no puede exceder los 255 caracteres"),
  lastName: z.string().max(255).optional().or(z.literal("")),
  idCard: z.string().max(20).optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  nationality: z.enum(["V", "E", "J", ""]).optional().or(z.literal("")),
  sex: z.enum(["M", "F", ""]).optional().or(z.literal("")),
  age: z.coerce.number().int().positive().optional().nullable(),
  birthDate: z.string().optional().or(z.literal("")),
  profession: z.string().optional().or(z.literal("")),
  personType: z.enum(["PARTICIPANT", "THIRD_PARTY", "CASE_PERSON", ""]).optional().or(z.literal("")),
  legalInfo: z.string().optional().or(z.literal("")),
  countryId: z.coerce.number().int().positive().optional().nullable(),
  stateId: z.coerce.number().int().positive().optional().nullable(),
  municipalityId: z.coerce.number().int().positive().optional().nullable(),
  parishId: z.coerce.number().int().positive().optional().nullable(),
  beneficiaryTypeId: z.coerce.number().int().positive().optional().nullable(),
});
