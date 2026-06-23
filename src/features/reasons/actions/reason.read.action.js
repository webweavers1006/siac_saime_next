"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { REASON_CONFIG } from "../config/reason.constants";
import { fetchReasonsList } from "../services/reason.read.service";

export const getReasonsListAction = createProtectedFunction(
  REASON_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchReasonsList(params);
  }
);
