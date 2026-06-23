"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Flag } from "lucide-react";
import { CASE_STATUS_CONFIG } from "./case-status.constants";

export const getCaseStatusTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = CASE_STATUS_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: CASE_STATUS_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
