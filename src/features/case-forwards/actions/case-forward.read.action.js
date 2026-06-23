"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_FORWARD_CONFIG } from "../config/case-forward.constants";
import { fetchCaseForwardsByCaseId } from "../services/case-forward.read.service";

export const getCaseForwardsByCaseIdAction = createProtectedFunction(
  CASE_FORWARD_CONFIG.PERMISSIONS.READ,
  async (caseId) => {
    return fetchCaseForwardsByCaseId(caseId);
  }
);
