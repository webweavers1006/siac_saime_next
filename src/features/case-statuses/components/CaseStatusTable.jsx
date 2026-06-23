"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getCaseStatusTableColumns } from "../config/case-status.columns";
import { useCaseStatusDialogs } from "../hooks/use-case-status-table-dialogs";
import { useCaseStatusTableFilters } from "../hooks/use-case-status-table-filters";
import { CaseStatusTableView } from "./CaseStatusTableView";

export function CaseStatusTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useCaseStatusDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useCaseStatusTableFilters(pagination);

  const columns = useMemo(
    () => getCaseStatusTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <CaseStatusTableView
      items={data}
      isPending={isPending}
      pagination={paginationState}
      filters={filters}
      sortConfig={sortConfig}
      handlers={handlers}
      dialogState={dialogState}
      columns={columns}
    />
  );
}
