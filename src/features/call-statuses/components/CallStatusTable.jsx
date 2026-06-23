"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getCallStatusTableColumns } from "../config/call-status.columns";
import { useCallStatusDialogs } from "../hooks/use-call-status-table-dialogs";
import { useCallStatusTableFilters } from "../hooks/use-call-status-table-filters";
import { CallStatusTableView } from "./CallStatusTableView";

export function CallStatusTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useCallStatusDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useCallStatusTableFilters(pagination);

  const columns = useMemo(
    () => getCallStatusTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <CallStatusTableView
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
