"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { OFFICE_CONFIG } from "../config/offices.constants";
import { fetchOfficesList } from "../services/offices.read.service";

export const getOfficesListAction = createProtectedFunction(
  OFFICE_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchOfficesList(params);
  }
);
