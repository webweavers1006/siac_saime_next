"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Globe } from "lucide-react";
import { COUNTRY_CONFIG } from "./country.constants";

export const getCountryTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = COUNTRY_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: COUNTRY_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
