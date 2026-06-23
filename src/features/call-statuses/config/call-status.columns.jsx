"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { PhoneCall } from "lucide-react";
import { CALL_STATUS_CONFIG } from "./call-status.constants";

export const getCallStatusTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = CALL_STATUS_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <PhoneCall className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: CALL_STATUS_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
