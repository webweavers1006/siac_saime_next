"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { CaseToolbar } from "./CaseToolbar";
import { CaseTableDialogs } from "./CaseTableDialogs";
import { CASE_CONFIG } from "../config/case.constants";

export function CaseTableView({
  items,
  isPending,
  pagination,
  filters,
  sortConfig,
  handlers,
  dialogState,
  columns,
}) {
  const { LABELS } = CASE_CONFIG.UI;

  return (
    <div className="space-y-4">
      <CaseToolbar
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

      <CaseTableDialogs
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
