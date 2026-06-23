"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { ATTACHED_ENTITY_CONFIG } from "../config/attached-entity.constants";
import { fetchAttachedEntitiesList } from "../services/attached-entity.read.service";

export const getAttachedEntitiesListAction = createProtectedFunction(
  ATTACHED_ENTITY_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchAttachedEntitiesList(params);
  }
);
