"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";
import { fetchAdministrativeDirectionsList } from "../services/administrative-direction.read.service";

export const getAdministrativeDirectionsListAction = createProtectedFunction(
  ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchAdministrativeDirectionsList(params);
  }
);
