import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchCaseAreasList } from "@/features/case-areas/services/case-area.read.service";
import { CaseAreaTable } from "@/features/case-areas/components/CaseAreaTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CASE_AREA_CONFIG } from "@/features/case-areas/config/case-area.constants";

const { LABELS } = CASE_AREA_CONFIG.UI;

export async function CaseAreaPageContainer({ searchParams }) {
  let caseAreasData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : CASE_AREA_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    caseAreasData = await fetchCaseAreasList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading case areas data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{CASE_AREA_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CaseAreaTable 
          data={caseAreasData.items} 
          pagination={{
            page: caseAreasData.page,
            pageSize: caseAreasData.pageSize,
            totalPages: caseAreasData.totalPages,
            totalCount: caseAreasData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
