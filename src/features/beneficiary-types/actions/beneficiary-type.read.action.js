"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { BENEFICIARY_TYPE_CONFIG } from "../config/beneficiary-type.constants";
import { fetchBeneficiaryTypesList } from "../services/beneficiary-type.read.service";

export const getBeneficiaryTypesListAction = createProtectedFunction(
  BENEFICIARY_TYPE_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchBeneficiaryTypesList(params);
  }
);
