"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { AdministrativeDirectionToolbar } from "./AdministrativeDirectionToolbar";
import { AdministrativeDirectionTableDialogs } from "./AdministrativeDirectionTableDialogs";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";

export function AdministrativeDirectionTableView({
  items,
  isPending,
  pagination,
  filters,
  sortConfig,
  handlers,
  dialogState,
  columns
}) {
  const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

  return (
    <div className="space-y-4">
      <AdministrativeDirectionToolbar
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

      <AdministrativeDirectionTableDialogs
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
