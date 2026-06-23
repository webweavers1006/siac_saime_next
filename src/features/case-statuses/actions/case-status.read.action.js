"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_STATUS_CONFIG } from "../config/case-status.constants";
import { fetchCaseStatusesList } from "../services/case-status.read.service";

export const getCaseStatusesListAction = createProtectedFunction(
  CASE_STATUS_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchCaseStatusesList(params);
  }
);
