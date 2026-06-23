"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { AttentionTypeDetailToolbar } from "./AttentionTypeDetailToolbar";
import { AttentionTypeDetailTableDialogs } from "./AttentionTypeDetailTableDialogs";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "../config/attention-type-detail.constants";

export function AttentionTypeDetailTableView({
  items,
  isPending,
  pagination,
  filters,
  sortConfig,
  handlers,
  dialogState,
  columns
}) {
  const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

  return (
    <div className="space-y-4">
      <AttentionTypeDetailToolbar
        searchTerm={filters.searchTerm}
        onSearchChange={handlers.handleSearchChange}
        onReset={handlers.handleReset}
        onCreate={dialogState.handleCreate}
      />

      <DataTable
        data={items || []}
        columns={columns}
        sortConfig={sortConfig}
        onSort={handlers.handleSortChange}
        emptyMessage={filters.searchTerm ? LABELS.TABLE.EMPTY_SEARCH : LABELS.TABLE.EMPTY}
        isLoading={isPending}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          onPageChange: handlers.handlePageChange,
          currentCount: (items || []).length,
          totalCount: pagination.totalCount,
          entityName: LABELS.TABLE.NAME.toLowerCase(),
        }}
      />

      <AttentionTypeDetailTableDialogs
        open={dialogState.open}
        onOpenChange={dialogState.onOpenChange}
        editingItem={dialogState.editingItem}
        deletingItem={dialogState.deletingItem}
        setDeletingItem={dialogState.setDeletingItem}
        onSuccess={dialogState.handleSuccess}
      />
    </div>
  );
}
