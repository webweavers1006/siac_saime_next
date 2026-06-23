"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Tags } from "lucide-react";
import { ATTENTION_TYPE_CONFIG } from "./attention-type.constants";

export const getAttentionTypeTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = ATTENTION_TYPE_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tags className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: ATTENTION_TYPE_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
