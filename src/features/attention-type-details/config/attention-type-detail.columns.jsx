"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { ListTree } from "lucide-react";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "./attention-type-detail.constants";

export const getAttentionTypeDetailTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <ListTree className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "attentionTypeName",
      header: LABELS.TABLE.ATTENTION_TYPE,
      cell: (row) => (
        <span className="text-muted-foreground">{row.attentionTypeName || "—"}</span>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
