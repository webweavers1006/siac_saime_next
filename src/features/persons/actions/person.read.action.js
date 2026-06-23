"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { PERSON_CONFIG } from "../config/person.constants";
import { fetchPersonsList, fetchPersonById } from "../services/person.read.service";

export const getPersonsListAction = createProtectedFunction(
  PERSON_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchPersonsList(params);
  }
);

export const getPersonByIdAction = createProtectedFunction(
  PERSON_CONFIG.PERMISSIONS.READ,
  async (id) => {
    return fetchPersonById(id);
  }
);
