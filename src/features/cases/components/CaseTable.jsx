"use client";

import { useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getCaseTableColumns } from "../config/case.columns";
import { useCaseDialogs } from "../hooks/use-case-table-dialogs";
import { useCaseTableFilters } from "../hooks/use-case-table-filters";
import { CaseTableView } from "./CaseTableView";
import { CaseFollowUpDialog } from "@/features/case-follow-ups/components/CaseFollowUpDialog";
import { CaseForwardDialog } from "@/features/case-forwards/components/CaseForwardDialog";
import { CASE_CONFIG } from "../config/case.constants";

export function CaseTable({ data, pagination }) {
  const router = useRouter();
  const { can } = usePermission();
  const dialogState = useCaseDialogs();
  const [followUpCase, setFollowUpCase] = useState(null);
  const [forwardCase, setForwardCase] = useState(null);

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useCaseTableFilters(pagination);

  const handleDetail = useCallback(
    (item) => router.push(`${CASE_CONFIG.PATH}/${item.id}`),
    [router]
  );

  const handleFollowUp = useCallback((item) => setFollowUpCase(item), []);
  const handleForward = useCallback((item) => setForwardCase(item), []);

  const handleSheet = useCallback(
    async (item) => {
      try {
        const response = await fetch(`/api/case-sheets?caseId=${item.id}`);
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          throw new Error(body.error || "Error al generar la planilla.");
        }
        const blob = await response.blob();
        const disposition = response.headers.get("Content-Disposition") || "";
        const filenameMatch = disposition.match(/filename="?(.+?)"?$/);
        const filename = filenameMatch?.[1] || `planilla_caso_${item.id}.pdf`;
        const objectUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
      } catch (error) {
        // Silently fail — the API returns appropriate error responses
        console.error("Failed to download planilla:", error);
      }
    },
    []
  );

  const columns = useMemo(
    () =>
      getCaseTableColumns(
        dialogState.handleEdit,
        dialogState.handleDelete,
        can,
        isPending,
        handleDetail,
        handleFollowUp,
        handleForward,
        handleSheet
      ),
    [can, dialogState.handleEdit, dialogState.handleDelete, isPending, handleDetail, handleFollowUp, handleForward, handleSheet]
  );

  return (
    <>
      <CaseTableView
        items={data}
        isPending={isPending}
        pagination={paginationState}
        filters={filters}
        sortConfig={sortConfig}
        handlers={handlers}
        dialogState={dialogState}
        columns={columns}
      />

      <CaseFollowUpDialog
        open={!!followUpCase}
        onOpenChange={(open) => { if (!open) setFollowUpCase(null); }}
        caseData={followUpCase}
      />

      <CaseForwardDialog
        open={!!forwardCase}
        onOpenChange={(open) => { if (!open) setForwardCase(null); }}
        caseData={forwardCase}
      />
    </>
  );
}
