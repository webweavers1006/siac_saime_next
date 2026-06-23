"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { FolderTree } from "lucide-react";
import { CASE_AREA_CONFIG } from "./case-area.constants";

export const getCaseAreaTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = CASE_AREA_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: CASE_AREA_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
