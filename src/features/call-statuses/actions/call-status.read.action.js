"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CALL_STATUS_CONFIG } from "../config/call-status.constants";
import { fetchCallStatusesList } from "../services/call-status.read.service";

export const getCallStatusesListAction = createProtectedFunction(
  CALL_STATUS_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchCallStatusesList(params);
  }
);
