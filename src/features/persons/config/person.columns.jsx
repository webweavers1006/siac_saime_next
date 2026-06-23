"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { User, IdCard, MapPin, Tag } from "lucide-react";
import { PERSON_CONFIG } from "./person.constants";

const PERSON_TYPE_MAP = {
  PARTICIPANT: "Participante",
  THIRD_PARTY: "Tercero",
  CASE_PERSON: "Caso",
};

export const getPersonTableColumns = (onEdit, onDelete, can, isPending) => {
  const { LABELS } = PERSON_CONFIG.UI;

  return [
    {
      accessorKey: "firstName",
      header: LABELS.TABLE.FIRST_NAME,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">
            {[row.firstName, row.lastName].filter(Boolean).join(" ") || "—"}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "idCard",
      header: LABELS.TABLE.ID_CARD,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <IdCard className="h-4 w-4 text-muted-foreground/60" />
          <span>{row.idCard || "—"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "countryName",
      header: LABELS.TABLE.COUNTRY,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground/60" />
          <span>{row.countryName || "—"}</span>
        </div>
      ),
      sortable: false,
    },
    {
      accessorKey: "stateName",
      header: LABELS.TABLE.STATE,
      cell: (row) => (
        <span>{row.stateName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "personType",
      header: LABELS.TABLE.PERSON_TYPE,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground/60" />
          <span>{PERSON_TYPE_MAP[row.personType] || row.personType || "—"}</span>
        </div>
      ),
      sortable: true,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: PERSON_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS }
    }),
  ];
};
