"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { Building, Check, X } from "lucide-react";
import { OFFICE_CONFIG } from "./offices.constants";

export const getOfficeTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = OFFICE_CONFIG.UI;

  const renderBoolean = (value) =>
    value ? (
      <Check className="h-4 w-4 text-green-600" />
    ) : (
      <X className="h-4 w-4 text-muted-foreground/40" />
    );

  return [
    {
      accessorKey: "name",
      header: LABELS.TABLE.NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "code",
      header: LABELS.TABLE.CODE,
      cell: (row) => row.code ? <span className="font-mono text-xs">{row.code}</span> : <span className="text-muted-foreground">—</span>,
      sortable: true,
    },
    {
      accessorKey: "stateName",
      header: LABELS.TABLE.STATE,
      cell: (row) => row.stateName || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "chiefName",
      header: LABELS.TABLE.CHIEF_NAME,
      cell: (row) => row.chiefName || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "chiefPhone",
      header: LABELS.TABLE.CHIEF_PHONE,
      cell: (row) => row.chiefPhone || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "hasEmailChange",
      header: LABELS.TABLE.HAS_EMAIL_CHANGE,
      cell: (row) => renderBoolean(row.hasEmailChange),
      sortable: false,
    },
    {
      accessorKey: "hasForeignAffairs",
      header: LABELS.TABLE.HAS_FOREIGN_AFFAIRS,
      cell: (row) => renderBoolean(row.hasForeignAffairs),
      sortable: false,
    },
    {
      accessorKey: "hasMigration",
      header: LABELS.TABLE.HAS_MIGRATION,
      cell: (row) => renderBoolean(row.hasMigration),
      sortable: false,
    },
    {
      accessorKey: "enableQrTicket",
      header: LABELS.TABLE.ENABLE_QR_TICKET,
      cell: (row) => renderBoolean(row.enableQrTicket),
      sortable: false,
    },
    {
      accessorKey: "isActive",
      header: LABELS.TABLE.IS_ACTIVE,
      cell: (row) => renderBoolean(row.isActive),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: OFFICE_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
