"use server";

import { createProtectedFunction } from "@/features/shared/lib/safe-action";
import { CASE_DOCUMENT_CONFIG } from "../config/case-document.constants";
import { fetchCaseDocumentsList, fetchCaseDocumentById, fetchCaseDocumentsByCaseId } from "../services/case-document.read.service";

export const getCaseDocumentsListAction = createProtectedFunction(
  CASE_DOCUMENT_CONFIG.PERMISSIONS.READ,
  async (params) => {
    return fetchCaseDocumentsList(params);
  }
);

export const getCaseDocumentByIdAction = createProtectedFunction(
  CASE_DOCUMENT_CONFIG.PERMISSIONS.READ,
  async (id) => {
    return fetchCaseDocumentById(id);
  }
);

export const getCaseDocumentsByCaseIdAction = createProtectedFunction(
  CASE_DOCUMENT_CONFIG.PERMISSIONS.READ,
  async (caseId) => {
    return fetchCaseDocumentsByCaseId(caseId);
  }
);
