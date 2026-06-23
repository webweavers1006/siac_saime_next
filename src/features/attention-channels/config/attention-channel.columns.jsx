"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { MessageCircle } from "lucide-react";
import { ATTENTION_CHANNEL_CONFIG } from "./attention-channel.constants";

export const getAttentionChannelTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = ATTENTION_CHANNEL_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: ATTENTION_CHANNEL_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
