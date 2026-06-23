import { Suspense } from "react";
import { logger } from "@/features/shared/lib/logger";
import { fetchReasonsList } from "@/features/reasons/services/reason.read.service";
import { ReasonTable } from "@/features/reasons/components/ReasonTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { REASON_CONFIG } from "@/features/reasons/config/reason.constants";

const { LABELS } = REASON_CONFIG.UI;

export async function ReasonPageContainer({ searchParams }) {
  let reasonsData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : REASON_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    reasonsData = await fetchReasonsList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading reasons data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{REASON_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <ReasonTable
          data={reasonsData.items}
          pagination={{
            page: reasonsData.page,
            pageSize: reasonsData.pageSize,
            totalPages: reasonsData.totalPages,
            totalCount: reasonsData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
