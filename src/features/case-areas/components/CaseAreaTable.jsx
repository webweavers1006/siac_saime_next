"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getCaseAreaTableColumns } from "../config/case-area.columns";
import { useCaseAreaDialogs } from "../hooks/use-case-area-table-dialogs";
import { useCaseAreaTableFilters } from "../hooks/use-case-area-table-filters";
import { CaseAreaTableView } from "./CaseAreaTableView";

export function CaseAreaTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useCaseAreaDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useCaseAreaTableFilters(pagination);

  const columns = useMemo(
    () => getCaseAreaTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <CaseAreaTableView
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
