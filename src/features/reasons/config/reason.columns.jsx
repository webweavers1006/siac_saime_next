"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Tag } from "lucide-react";
import { REASON_CONFIG } from "./reason.constants";

export const getReasonTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = REASON_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "caseAreaName",
      header: LABELS.TABLE.CASE_AREA,
      cell: (row) => (
        <span className="text-muted-foreground">{row.caseAreaName || "—"}</span>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: REASON_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
