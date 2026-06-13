"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getUserTableColumns } from "../config/user.columns";
import { useUserTableDialogs } from "../hooks/use-user-table-dialogs";
import { useUserSelection } from "../hooks/use-user-selection";
import { useUserTableFilters } from "../hooks/use-user-table-filters";
import { UserTableView } from "./UserTableView";

/**
 * Main Users Table Component (Container).
 */
export function UserTable({ data, pagination }) {
  const { can } = usePermission();

  // Dialogs state
  const dialogState = useUserTableDialogs();

  // Selection state (rows)
  const selection = useUserSelection(data);

  // Filters, pagination and sorting synced with URL
  const { isPending, filters, paginationState, sortConfig, handlers } =
    useUserTableFilters(pagination);

  const columns = useMemo(
    () => getUserTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <UserTableView
      users={data}
      isPending={isPending}
      pagination={paginationState}
      filters={filters}
      sortConfig={sortConfig}
      onSearchChange={handlers.handleSearchChange}
      onStatusChange={handlers.handleStatusChange}
      onPageChange={handlers.handlePageChange}
      onReset={handlers.handleReset}
      dialogState={dialogState}
      columns={columns}
      selection={selection}
      onSortChange={handlers.handleSortChange}
    />
  );
}
