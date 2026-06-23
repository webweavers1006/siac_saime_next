"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_FOLLOW_UP_CONFIG } from "../config/case-follow-up.constants";
import { fetchCaseFollowUpsByCaseId } from "../services/case-follow-up.read.service";

export const getCaseFollowUpsByCaseIdAction = createProtectedFunction(
  CASE_FOLLOW_UP_CONFIG.PERMISSIONS.READ,
  async (caseId) => {
    return fetchCaseFollowUpsByCaseId(caseId);
  }
);
