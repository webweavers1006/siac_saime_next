"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getPersonTableColumns } from "../config/person.columns";
import { usePersonDialogs } from "../hooks/use-person-table-dialogs";
import { usePersonTableFilters } from "../hooks/use-person-table-filters";
import { PersonTableView } from "./PersonTableView";

export function PersonTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = usePersonDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    usePersonTableFilters(pagination);

  const columns = useMemo(
    () => getPersonTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <PersonTableView
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
