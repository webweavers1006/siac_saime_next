"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getOfficeTableColumns } from "../config/offices.columns";
import { useOfficeDialogs } from "../hooks/use-offices-table-dialogs";
import { useOfficeTableFilters } from "../hooks/use-offices-table-filters";
import { OfficeTableView } from "./OfficeTableView";

export function OfficeTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useOfficeDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useOfficeTableFilters(pagination);

  const columns = useMemo(
    () => getOfficeTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <OfficeTableView
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
