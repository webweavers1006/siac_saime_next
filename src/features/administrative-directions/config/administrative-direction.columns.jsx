"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { MapPin } from "lucide-react";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "./administrative-direction.constants";

export const getAdministrativeDirectionTableColumns = (onEdit, onDelete, onAreas, can, isPending) => {
  const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "email",
      header: LABELS.TABLE.EMAIL,
      cell: (row) => (
        <span className="text-muted-foreground">{row.email || "—"}</span>
      ),
      sortable: true,
    },
    {
      accessorKey: "isAudit",
      header: LABELS.TABLE.IS_AUDIT,
      cell: (row) => (
        <span className={row.isAudit ? "text-green-600 font-medium" : "text-muted-foreground"}>
          {row.isAudit ? LABELS.TABLE.YES : LABELS.TABLE.NO}
        </span>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS },
      extraActions: [
        {
          label: "Áreas",
          icon: MapPin,
          onClick: (item) => onAreas(item),
        },
      ],
    }),
  ];
};
