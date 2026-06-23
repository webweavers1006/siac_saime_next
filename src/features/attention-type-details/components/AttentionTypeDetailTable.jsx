"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getAttentionTypeDetailTableColumns } from "../config/attention-type-detail.columns";
import { useAttentionTypeDetailDialogs } from "../hooks/use-attention-type-detail-table-dialogs";
import { useAttentionTypeDetailTableFilters } from "../hooks/use-attention-type-detail-table-filters";
import { AttentionTypeDetailTableView } from "./AttentionTypeDetailTableView";

export function AttentionTypeDetailTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useAttentionTypeDetailDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useAttentionTypeDetailTableFilters(pagination);

  const columns = useMemo(
    () => getAttentionTypeDetailTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <AttentionTypeDetailTableView
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
