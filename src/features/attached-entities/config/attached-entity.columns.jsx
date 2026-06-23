"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Building2 } from "lucide-react";
import { ATTACHED_ENTITY_CONFIG } from "./attached-entity.constants";

export const getAttachedEntityTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = ATTACHED_ENTITY_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: ATTACHED_ENTITY_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
