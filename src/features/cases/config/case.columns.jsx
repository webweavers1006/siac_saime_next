"use client";

import { createActionsColumn } from "@/components/shared/TableUtils";
import { FileText, Eye, PhoneCall, Send, Printer } from "lucide-react";
import { CASE_CONFIG } from "./case.constants";
import { formatDate } from "@/features/shared/lib/date-utils";

export const getCaseTableColumns = (onEdit, onDelete, can, isPending, onDetail, onFollowUp, onForward, onSheet) => {
  const { LABELS } = CASE_CONFIG.UI;

  const canViewDetail = can(CASE_CONFIG.PERMISSIONS.VIEW);
  const canFollowUp = can("case_follow_ups:create");
  const canForward = can("case_forwards:create");
  const canGenerateSheet = can("case_sheets:generate");

  return [
    {
      accessorKey: "requestNumber",
      header: LABELS.TABLE.REQUEST_NUMBER,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary/70" />
          <span className="font-medium text-foreground">{row.requestNumber || "—"}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "caseDate",
      header: LABELS.TABLE.CASE_DATE,
      cell: (row) => (
        <span className="text-sm text-muted-foreground">{formatDate(row.caseDate)}</span>
      ),
      sortable: true,
    },
    {
      accessorKey: "personName",
      header: LABELS.TABLE.PERSON,
      cell: (row) => (
        <span className="text-sm">{row.personName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "caseAreaName",
      header: LABELS.TABLE.CASE_AREA,
      cell: (row) => (
        <span className="text-sm">{row.caseAreaName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "reasonName",
      header: LABELS.TABLE.REASON,
      cell: (row) => (
        <span className="text-sm">{row.reasonName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "caseStatusName",
      header: LABELS.TABLE.CASE_STATUS,
      cell: (row) => (
        <span className="text-sm">{row.caseStatusName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "attentionTypeName",
      header: LABELS.TABLE.ATTENTION_TYPE,
      cell: (row) => (
        <span className="text-sm">{row.attentionTypeName || "—"}</span>
      ),
      sortable: false,
    },
    {
      accessorKey: "attentionChannelName",
      header: LABELS.TABLE.ATTENTION_CHANNEL,
      cell: (row) => (
        <span className="text-sm">{row.attentionChannelName || "—"}</span>
      ),
      sortable: false,
    },
    createActionsColumn({
      onEdit,
      onDelete,
      can,
      permissions: CASE_CONFIG.PERMISSIONS,
      isFetching: isPending,
      labels: { ACTIONS: LABELS.TABLE.ACTIONS },
      extraActions: [
        ...(onDetail ? [{
          label: LABELS.TABLE.DETAIL || "Detalle",
          icon: Eye,
          onClick: onDetail,
          show: () => canViewDetail,
        }] : []),
        ...(onFollowUp ? [{
          label: LABELS.TABLE.FOLLOW_UP || "Seguimiento",
          icon: PhoneCall,
          onClick: onFollowUp,
          show: () => canFollowUp,
        }] : []),
        ...(onForward ? [{
          label: LABELS.TABLE.FORWARD || "Remitir",
          icon: Send,
          onClick: onForward,
          show: () => canForward,
        }] : []),
        ...(onSheet ? [{
          label: LABELS.TABLE.PLANILLA || "Planilla",
          icon: Printer,
          onClick: onSheet,
          show: () => canGenerateSheet,
        }] : []),
      ],
    }),
  ];
};
