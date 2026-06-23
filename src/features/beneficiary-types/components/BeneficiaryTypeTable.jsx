"use client";

import { useMemo } from "react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getBeneficiaryTypeTableColumns } from "../config/beneficiary-type.columns";
import { useBeneficiaryTypeDialogs } from "../hooks/use-beneficiary-type-table-dialogs";
import { useBeneficiaryTypeTableFilters } from "../hooks/use-beneficiary-type-table-filters";
import { BeneficiaryTypeTableView } from "./BeneficiaryTypeTableView";

export function BeneficiaryTypeTable({ data, pagination }) {
  const { can } = usePermission();
  const dialogState = useBeneficiaryTypeDialogs();

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useBeneficiaryTypeTableFilters(pagination);

  const columns = useMemo(
    () => getBeneficiaryTypeTableColumns(dialogState.handleEdit, dialogState.handleDelete, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <BeneficiaryTypeTableView
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
