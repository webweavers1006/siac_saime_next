"use client";

import { Mail, CheckCircle, XCircle, AlertTriangle, Calendar, Send } from "lucide-react";
import { SENT_EMAIL_CONFIG } from "./sent-email.constants";
import { formatDate, formatTime } from "@/features/shared/lib/date-utils";
import { resendEmailAction } from "../actions/sent-email.write.action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const getSentEmailTableColumns = () => {
  const { LABELS } = SENT_EMAIL_CONFIG.UI;

  return [
    {
      accessorKey: "toAddress",
      header: LABELS.TABLE.DESTINATION,
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary/70 shrink-0" />
          <span className="text-sm">{row.toAddress}</span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "subject",
      header: LABELS.TABLE.SUBJECT,
      cell: (row) => (
        <span className="text-sm font-medium">{row.subject}</span>
      ),
      sortable: true,
    },
    {
      accessorKey: "reason",
      header: LABELS.TABLE.REASON,
      cell: (row) => (
        <span className="text-sm">
          {LABELS.REASONS_MAP[row.reason] || row.reason}
        </span>
      ),
      sortable: true,
    },
    {
      accessorKey: "status",
      header: LABELS.TABLE.STATUS,
      cell: (row) => {
        const statusIcons = {
          sent: <CheckCircle className="h-4 w-4 text-green-600" />,
          failed: <XCircle className="h-4 w-4 text-red-600" />,
          bounced: <AlertTriangle className="h-4 w-4 text-amber-600" />,
        };
        const statusColors = {
          sent: "text-green-700 bg-green-50",
          failed: "text-red-700 bg-red-50",
          bounced: "text-amber-700 bg-amber-50",
        };
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status] || "text-gray-700 bg-gray-50"}`}>
            {statusIcons[row.status] || null}
            {LABELS.STATUS_MAP[row.status] || row.status}
          </span>
        );
      },
      sortable: true,
    },
    {
      accessorKey: "sentAt",
      header: LABELS.TABLE.DATE,
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground">
            {formatDate(row.sentAt)} {formatTime(row.sentAt)}
          </span>
        </div>
      ),
      sortable: true,
    },
    {
      accessorKey: "caseNumber",
      header: LABELS.TABLE.CASE,
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.caseNumber || "—"}
        </span>
      ),
      sortable: false,
    },
    {
      accessorKey: "userName",
      header: LABELS.TABLE.USER,
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.userName || "Sistema"}
        </span>
      ),
      sortable: false,
    },
    {
      accessorKey: "errorMessage",
      header: LABELS.TABLE.ERROR,
      cell: (row) => (
        <span className="text-xs text-red-600 max-w-[200px] truncate block">
          {row.errorMessage || "—"}
        </span>
      ),
      sortable: false,
    },
    {
      id: "actions",
      header: "Acciones",
      cell: (row) => (
        <Button
          variant="ghost"
          size="icon"
          title="Reenviar correo"
          onClick={async () => {
            const result = await resendEmailAction({ sentEmailId: row.id });
            if (result.success) {
              toast.success("Correo reenviado exitosamente.");
            } else {
              toast.error(result.error || "Error al reenviar.");
            }
          }}
        >
          <Send className="h-4 w-4" />
        </Button>
      ),
      sortable: false,
    },
  ];
};
