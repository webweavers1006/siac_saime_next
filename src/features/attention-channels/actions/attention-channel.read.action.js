"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { ATTENTION_CHANNEL_CONFIG } from "../config/attention-channel.constants";
import { fetchAttentionChannelsList } from "../services/attention-channel.read.service";

export const getAttentionChannelsListAction = createProtectedFunction(
  ATTENTION_CHANNEL_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchAttentionChannelsList(params);
  }
);
