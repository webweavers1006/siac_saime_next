"use client";

import { DataTable } from "@/components/shared/table/DataTable";
import { UserToolbar } from "./UserToolbar";
import { UserTableDialogs } from "./UserTableDialogs";
import { USER_CONFIG } from "../config/user.constants";

export function UserTableView({
  users,
  isPending,
  pagination,
  filters,
  sortConfig,
  onSearchChange,
  onStatusChange,
  onPageChange,
  dialogState,
  columns,
  onReset,
  onSortChange
}) {
  const { UI: { LABELS: { TABLE } } } = USER_CONFIG;

  const {
    open,
    onOpenChange,
    editingUser,
    deletingUser,
    setDeletingUser,
    handleCreate,
    handleSuccess
  } = dialogState;

  return (
    <div className="space-y-4">
      <UserToolbar
        searchTerm={filters?.searchTerm || ""}
        onSearchChange={onSearchChange}
        statusFilter={filters?.status || "all"}
        onStatusChange={onStatusChange}
        onReset={onReset}
        onCreate={handleCreate}
      />

      <DataTable
        data={users || []}
        columns={columns}
        sortConfig={sortConfig}
        onSort={onSortChange}
        emptyMessage={(filters?.searchTerm || "") ? TABLE.EMPTY_SEARCH : TABLE.EMPTY_DATA}
        isLoading={isPending}
        pagination={{
          currentPage: pagination?.currentPage || 1,
          totalPages: pagination?.totalPages || 1,
          onPageChange: onPageChange,
          currentCount: (users || []).length,
          totalCount: pagination?.totalCount || 0,
          entityName: TABLE.ENTITY_NAME,
        }}
      />

      <UserTableDialogs
        open={open}
        onOpenChange={onOpenChange}
        editingUser={editingUser}
        deletingUser={deletingUser}
        setDeletingUser={setDeletingUser}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

