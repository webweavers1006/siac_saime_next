import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchCallStatusesList } from "@/features/call-statuses/services/call-status.read.service";
import { CallStatusTable } from "@/features/call-statuses/components/CallStatusTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CALL_STATUS_CONFIG } from "@/features/call-statuses/config/call-status.constants";

const { LABELS } = CALL_STATUS_CONFIG.UI;

export async function CallStatusPageContainer({ searchParams }) {
  let statusesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : CALL_STATUS_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    statusesData = await fetchCallStatusesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading call statuses data:", error);
    return (
      <ErrorAlert
        title="Error"
        message={LABELS.MESSAGES.ERROR.LOAD}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{CALL_STATUS_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CallStatusTable 
          data={statusesData.items} 
          pagination={{
            page: statusesData.page,
            pageSize: statusesData.pageSize,
            totalPages: statusesData.totalPages,
            totalCount: statusesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
