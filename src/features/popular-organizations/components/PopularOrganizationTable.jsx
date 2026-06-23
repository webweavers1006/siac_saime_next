"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getPopularOrganizationTableColumns } from "../config/popular-organization.columns";
import { usePopularOrganizationDialogs } from "../hooks/use-popular-organization-table-dialogs";
import { usePopularOrganizationTableFilters } from "../hooks/use-popular-organization-table-filters";
import { PopularOrganizationTableView } from "./PopularOrganizationTableView";

export function PopularOrganizationTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = usePopularOrganizationDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    usePopularOrganizationTableFilters(pagination);

  const columns = useMemo(
    () => getPopularOrganizationTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <PopularOrganizationTableView
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
