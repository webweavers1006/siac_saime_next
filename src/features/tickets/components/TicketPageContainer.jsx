import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchTicketsList } from "@/features/tickets/services/ticket.read.service";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { TICKET_CONFIG } from "@/features/tickets";
import TicketQueueTable from "./TicketQueueTable";
import TicketAdvisorWrapper from "./TicketAdvisorWrapper";

const { LABELS } = TICKET_CONFIG.UI;

export async function TicketPageContainer({ searchParams, session }) {
  let ticketsData;
  let searchTerm = "";
  let officeId = null;
  let status = null;
  let attentionTypeId = null;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "createdAt";
    const sortDirection = params.sortDirection || "desc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : TICKET_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    searchTerm = params.q || "";
    officeId = params.officeId ? Number(params.officeId) : null;
    status = params.status || null;
    attentionTypeId = params.attentionTypeId ? Number(params.attentionTypeId) : null;

    ticketsData = await fetchTicketsList(session, {
      page,
      pageSize,
      searchTerm,
      sortKey,
      sortDirection,
      officeId,
      status,
      attentionTypeId,
      dateFrom: params.dateFrom || null,
      dateTo: params.dateTo || null,
    });
  } catch (error) {
    logger.error("Error loading tickets data:", error);
    return (
      <ErrorAlert
        title="Error"
        message={LABELS.MESSAGES.ERROR.LOAD}
      />
    );
  }

  const filters = { searchTerm, officeId, status, attentionTypeId };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{TICKET_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">{LABELS.DESCRIPTION}</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<TableSkeleton />}>
            <TicketQueueTable
              data={ticketsData.items}
              pagination={{
                page: ticketsData.page,
                pageSize: ticketsData.pageSize,
                totalPages: ticketsData.totalPages,
                totalCount: ticketsData.totalCount,
              }}
              filters={filters}
            />
          </Suspense>
        </div>
        {session?.id && (
          <div className="w-full lg:w-80 shrink-0">
            <TicketAdvisorWrapper
              userId={session.id}
              officeId={ticketsData.userOfficeId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
