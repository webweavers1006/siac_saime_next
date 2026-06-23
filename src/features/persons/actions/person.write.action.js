"use server";

import { createProtectedAction, createProtectedFunction } from "@/features/shared/lib/safe-action";
import {
  createPerson,
  updatePerson,
  deletePerson,
} from "../services/person.write.service";
import { PERSON_CONFIG } from "../config/person.constants";
import { personSchema } from "../schemas/person.schema";
import { logger } from "@/features/shared/lib/logger";
import { revalidatePath } from "next/cache";

export const savePersonAction = createProtectedAction(
  (data) => data.id ? PERSON_CONFIG.PERMISSIONS.UPDATE : PERSON_CONFIG.PERMISSIONS.WRITE,
  personSchema,
  async (data) => {
    try {
      const { id, ...rest } = data;

      let result;
      if (id) {
        result = await updatePerson(id, rest);
      } else {
        result = await createPerson(rest);
      }

      if (result.success) {
        revalidatePath(PERSON_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to save person", { error: error.message });
      return { success: false, error: "Error inesperado en el servidor." };
    }
  }
);

export const deletePersonAction = createProtectedFunction(
  PERSON_CONFIG.PERMISSIONS.DELETE,
  async (id) => {
    try {
      const result = await deletePerson(id);
      if (result.success) {
        revalidatePath(PERSON_CONFIG.PATH);
      }
      return result;
    } catch (error) {
      logger.error("Failed to delete person", { error: error.message, personId: id });
      return { success: false, error: "Error inesperado al eliminar." };
    }
  }
);
