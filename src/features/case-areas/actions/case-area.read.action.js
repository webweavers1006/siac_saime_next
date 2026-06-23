"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_AREA_CONFIG } from "../config/case-area.constants";
import { fetchCaseAreasList } from "../services/case-area.read.service";

export const getCaseAreasListAction = createProtectedFunction(
  CASE_AREA_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchCaseAreasList(params);
  }
);
