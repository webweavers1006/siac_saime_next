"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getAdministrativeDirectionTableColumns } from "../config/administrative-direction.columns";
import { useAdministrativeDirectionDialogs } from "../hooks/use-administrative-direction-table-dialogs";
import { useAdministrativeDirectionTableFilters } from "../hooks/use-administrative-direction-table-filters";
import { AdministrativeDirectionTableView } from "./AdministrativeDirectionTableView";
import { DirectionAreasDialog } from "./DirectionAreasDialog";

export function AdministrativeDirectionTable({ data, pagination, allAreas = [] }) {
  const { can } = usePermission();
  const router = useRouter();
  const dialogState = useAdministrativeDirectionDialogs();
  const [areasItem, setAreasItem] = useState(null);

  const { isPending, filters, paginationState, sortConfig, handlers } =
    useAdministrativeDirectionTableFilters(pagination);

  const handleAreas = (item) => setAreasItem(item);

  const columns = useMemo(
    () => getAdministrativeDirectionTableColumns(dialogState.handleEdit, dialogState.handleDelete, handleAreas, can),
    [can, dialogState.handleEdit, dialogState.handleDelete]
  );

  return (
    <>
      <AdministrativeDirectionTableView
        items={data}
        isPending={isPending}
        pagination={paginationState}
        filters={filters}
        sortConfig={sortConfig}
        handlers={handlers}
        dialogState={dialogState}
        columns={columns}
      />
      <DirectionAreasDialog
        direction={areasItem}
        allAreas={allAreas}
        open={!!areasItem}
        onOpenChange={(open) => !open && setAreasItem(null)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
