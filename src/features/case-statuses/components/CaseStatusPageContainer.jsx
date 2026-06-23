import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchCaseStatusesList } from "@/features/case-statuses/services/case-status.read.service";
import { CaseStatusTable } from "@/features/case-statuses/components/CaseStatusTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CASE_STATUS_CONFIG } from "@/features/case-statuses/config/case-status.constants";

const { LABELS } = CASE_STATUS_CONFIG.UI;

export async function CaseStatusPageContainer({ searchParams }) {
  let statusesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : CASE_STATUS_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    statusesData = await fetchCaseStatusesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading case statuses data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{CASE_STATUS_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CaseStatusTable 
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
