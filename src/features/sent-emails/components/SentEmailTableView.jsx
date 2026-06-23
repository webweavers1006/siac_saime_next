"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { SentEmailToolbar } from "./SentEmailToolbar";
import { getSentEmailTableColumns } from "../config/sent-email.columns";
import { useMemo } from "react";
import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";

export function SentEmailTableView({
  items,
  isPending,
  pagination,
  filters,
  sortConfig,
  handlers,
}) {
  const { LABELS } = SENT_EMAIL_CONFIG.UI;
  const columns = useMemo(() => getSentEmailTableColumns(), []);

  return (
    <div className="space-y-4">
      <SentEmailToolbar
        searchTerm={filters.searchTerm}
        onSearchChange={handlers.handleSearchChange}
        onReset={handlers.handleReset}
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
          entityName: "correo",
        }}
      />
    </div>
  );
}
