"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Users } from "lucide-react";
import { POPULAR_ORGANIZATION_CONFIG } from "./popular-organization.constants";

export const getPopularOrganizationTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: POPULAR_ORGANIZATION_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
