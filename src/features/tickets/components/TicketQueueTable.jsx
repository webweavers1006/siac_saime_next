"use client";

import { useMemo, useState, useCallback, useRef, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/components/shared/table/DataTable";
import { TicketToolbar } from "./TicketToolbar";
import { TicketFormDialog } from "./TicketFormDialog";
import { TICKET_CONFIG } from "../config/ticket.constants";

const STATUS_COLORS = {
  CREATED: "bg-gray-100 text-gray-800",
  WAITING: "bg-blue-100 text-blue-800",
  CALLED: "bg-yellow-100 text-yellow-800",
  IN_ATTENTION: "bg-green-100 text-green-800",
  FINISHED: "bg-emerald-100 text-emerald-800",
  DERIVED: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function TicketQueueTable({ data, pagination }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { LABELS } = TICKET_CONFIG.UI;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchParams.get("q") || "");

  const searchDebounceRef = useRef(null);

  const navigateWithParams = useCallback((next) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "" || v === "all") params.delete(k);
      else params.set(k, String(v));
    });
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams]);

  const handleSearchChange = useCallback((value) => {
    setLocalSearchTerm(value);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      navigateWithParams({ q: value, page: 1 });
    }, 400);
  }, [navigateWithParams]);

  const handleReset = useCallback(() => {
    setLocalSearchTerm("");
    startTransition(() => router.push(""));
  }, [router]);

  const handleCreate = useCallback(() => setDialogOpen(true), []);
  const handleSuccess = useCallback(() => {
    startTransition(() => router.refresh());
  }, [router]);

  // Auto-refresh table every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => router.refresh());
    }, 8000);
    return () => clearInterval(interval);
  }, [router]);

  const columns = useMemo(() => [
    {
      accessorKey: "ticketNumber",
      header: LABELS.TABLE.TICKET_NUMBER,
      cell: (row) => (
        <span className="font-mono font-bold text-sm">{row.ticketNumber}</span>
      ),
      sortable: true,
    },
    {
      accessorKey: "status",
      header: LABELS.TABLE.STATUS,
      cell: (row) => (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[row.status] || ""}`}>
          {TICKET_CONFIG.STATUS_LABELS[row.status] || row.status}
        </span>
      ),
      sortable: true,
    },
    {
      accessorKey: "officeName",
      header: LABELS.TABLE.OFFICE,
      cell: (row) => row.officeName || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "attentionTypeName",
      header: LABELS.TABLE.ATTENTION_TYPE,
      cell: (row) => row.attentionTypeName || <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "personFirstName",
      header: LABELS.TABLE.PERSON,
      cell: (row) => {
        if (!row.personFirstName && !row.personLastName) return <span className="text-muted-foreground">—</span>;
        return (
          <span>
            {row.personFirstName || ""} {row.personLastName || ""}
            {row.personIdCard && <span className="text-xs text-muted-foreground ml-1">CI:{row.personIdCard}</span>}
          </span>
        );
      },
      sortable: false,
    },
    {
      accessorKey: "deskNumber",
      header: LABELS.TABLE.DESK,
      cell: (row) => row.deskNumber ? `Taq. ${row.deskNumber}` : <span className="text-muted-foreground">—</span>,
      sortable: false,
    },
    {
      accessorKey: "serviceType",
      header: LABELS.TABLE.SERVICE,
      cell: (row) => {
        const labels = { FOREIGN_AFFAIRS: "Extranjería", MIGRATION: "Migración", EMAIL_CHANGE: "Cambio Correo", GENERAL: "General" };
        return row.serviceType ? (labels[row.serviceType] || row.serviceType) : <span className="text-muted-foreground">—</span>;
      },
      sortable: false,
    },
    {
      accessorKey: "createdAtTime",
      header: LABELS.TABLE.CREATED_AT,
      cell: (row) => row.createdAtTime || "—",
      sortable: true,
      sortKey: "createdAt",
    },
  ], [LABELS]);

  return (
    <div className="space-y-4">
      <TicketToolbar
        searchTerm={localSearchTerm}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
        onCreate={handleCreate}
      />

      <DataTable
        data={data || []}
        columns={columns}
        emptyMessage={localSearchTerm ? LABELS.TABLE.EMPTY_SEARCH : LABELS.TABLE.EMPTY}
        isLoading={isPending}
        pagination={{
          currentPage: pagination?.page || 1,
          totalPages: pagination?.totalPages || 1,
          onPageChange: (p) => navigateWithParams({ page: p }),
          currentCount: (data || []).length,
          totalCount: pagination?.totalCount || 0,
          entityName: "turnos",
        }}
      />

      <TicketFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
