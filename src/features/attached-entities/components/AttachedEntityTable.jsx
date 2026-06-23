"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getAttachedEntityTableColumns } from "../config/attached-entity.columns";
import { useAttachedEntityDialogs } from "../hooks/use-attached-entity-table-dialogs";
import { useAttachedEntityTableFilters } from "../hooks/use-attached-entity-table-filters";
import { AttachedEntityTableView } from "./AttachedEntityTableView";

export function AttachedEntityTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useAttachedEntityDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useAttachedEntityTableFilters(pagination);

  const columns = useMemo(
    () => getAttachedEntityTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <AttachedEntityTableView
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
