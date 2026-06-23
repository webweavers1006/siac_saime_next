import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchOfficesList } from "@/features/offices/services/offices.read.service";
import { OfficeTable } from "@/features/offices/components/OfficeTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { OFFICE_CONFIG } from "@/features/offices/config/offices.constants";

const { LABELS } = OFFICE_CONFIG.UI;

export async function OfficePageContainer({ searchParams }) {
  let officesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : OFFICE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    officesData = await fetchOfficesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading offices data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{OFFICE_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <OfficeTable 
          data={officesData.items} 
          pagination={{
            page: officesData.page,
            pageSize: officesData.pageSize,
            totalPages: officesData.totalPages,
            totalCount: officesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
