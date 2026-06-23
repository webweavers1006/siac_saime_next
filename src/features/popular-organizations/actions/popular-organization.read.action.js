"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { POPULAR_ORGANIZATION_CONFIG } from "../config/popular-organization.constants";
import { fetchPopularOrganizationsList } from "../services/popular-organization.read.service";

export const getPopularOrganizationsListAction = createProtectedFunction(
  POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchPopularOrganizationsList(params);
  }
);
