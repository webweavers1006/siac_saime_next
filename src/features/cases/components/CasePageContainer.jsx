import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchCasesList } from "@/features/cases/services/case.read.service";
import { CaseTable } from "@/features/cases/components/CaseTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CASE_CONFIG } from "@/features/cases/config/case.constants";

const { LABELS } = CASE_CONFIG.UI;

export async function CasePageContainer({ searchParams }) {
  let casesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "createdAt";
    const sortDirection = params.sortDirection || "desc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : CASE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    casesData = await fetchCasesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading cases data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{CASE_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CaseTable
          data={casesData.items}
          pagination={{
            page: casesData.page,
            pageSize: casesData.pageSize,
            totalPages: casesData.totalPages,
            totalCount: casesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
