"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "../config/attention-type-detail.constants";
import { fetchAttentionTypeDetailsList } from "../services/attention-type-detail.read.service";

export const getAttentionTypeDetailsListAction = createProtectedFunction(
  ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchAttentionTypeDetailsList(params);
  }
);
