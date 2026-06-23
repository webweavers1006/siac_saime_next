"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getAttentionTypeTableColumns } from "../config/attention-type.columns";
import { useAttentionTypeDialogs } from "../hooks/use-attention-type-table-dialogs";
import { useAttentionTypeTableFilters } from "../hooks/use-attention-type-table-filters";
import { AttentionTypeTableView } from "./AttentionTypeTableView";

export function AttentionTypeTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useAttentionTypeDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useAttentionTypeTableFilters(pagination);

  const columns = useMemo(
    () => getAttentionTypeTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <AttentionTypeTableView
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
