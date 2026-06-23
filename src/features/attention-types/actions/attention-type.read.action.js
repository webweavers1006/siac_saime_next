"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { ATTENTION_TYPE_CONFIG } from "../config/attention-type.constants";
import { fetchAttentionTypesList } from "../services/attention-type.read.service";

export const getAttentionTypesListAction = createProtectedFunction(
  ATTENTION_TYPE_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchAttentionTypesList(params);
  }
);
