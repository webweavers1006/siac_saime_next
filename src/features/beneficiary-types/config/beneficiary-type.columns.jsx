"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { UserCheck } from "lucide-react";
import { BENEFICIARY_TYPE_CONFIG } from "./beneficiary-type.constants";

export const getBeneficiaryTypeTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "requiresIdCard",
      header: LABELS.TABLE.REQUIRES_ID_CARD,
      cell: (row) => (
        <span className={row.requiresIdCard ? "text-green-600 font-medium" : "text-muted-foreground"}>
          {row.requiresIdCard ? "Sí" : "No"}
        </span>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: BENEFICIARY_TYPE_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
