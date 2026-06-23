import { Suspense } from "react";
import { fetchSentEmailsList } from "@/features/sent-emails/services/sent-email.read.service";
import { SentEmailTable } from "@/features/sent-emails/components/SentEmailTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { logger } from "@/features/shared/lib/logger";
import { SENT_EMAIL_CONFIG } from "@/features/sent-emails/config/sent-email.constants";

const { LABELS } = SENT_EMAIL_CONFIG.UI;

export async function SentEmailPageContainer({ searchParams }) {
  let emailData;

  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "sentAt";
    const sortDirection = params.sortDirection || "desc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize
      ? Number(params.pageSize)
      : SENT_EMAIL_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";
    const reason = params.reason || undefined;
    const status = params.status || undefined;
    const dateFrom = params.dateFrom || undefined;
    const dateTo = params.dateTo || undefined;

    emailData = await fetchSentEmailsList({
      page,
      pageSize,
      searchTerm,
      reason,
      status,
      dateFrom,
      dateTo,
      sortKey,
      sortDirection,
    });
  } catch (error) {
    logger.error("Error loading sent emails", { error: error.message });
    return <ErrorAlert title="Error" message={LABELS.MESSAGES.ERROR.LOAD} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{SENT_EMAIL_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">{LABELS.DESCRIPTION}</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <SentEmailTable
          data={emailData.items}
          pagination={{
            page: emailData.page,
            pageSize: emailData.pageSize,
            totalPages: emailData.totalPages,
            totalCount: emailData.totalCount,
          }}
        />
      </Suspense>
    </div>
  );
}
