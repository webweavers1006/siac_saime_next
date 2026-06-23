"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getAttentionChannelTableColumns } from "../config/attention-channel.columns";
import { useAttentionChannelDialogs } from "../hooks/use-attention-channel-table-dialogs";
import { useAttentionChannelTableFilters } from "../hooks/use-attention-channel-table-filters";
import { AttentionChannelTableView } from "./AttentionChannelTableView";

export function AttentionChannelTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useAttentionChannelDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useAttentionChannelTableFilters(pagination);

  const columns = useMemo(
    () => getAttentionChannelTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <AttentionChannelTableView
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
