"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getReasonTableColumns } from "../config/reason.columns";
import { useReasonDialogs } from "../hooks/use-reason-table-dialogs";
import { useReasonTableFilters } from "../hooks/use-reason-table-filters";
import { ReasonTableView } from "./ReasonTableView";

export function ReasonTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useReasonDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useReasonTableFilters(pagination);

  const columns = useMemo(
    () => getReasonTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <ReasonTableView
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
