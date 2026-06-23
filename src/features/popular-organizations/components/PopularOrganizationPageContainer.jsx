import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchPopularOrganizationsList } from "@/features/popular-organizations/services/popular-organization.read.service";
import { PopularOrganizationTable } from "@/features/popular-organizations/components/PopularOrganizationTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { POPULAR_ORGANIZATION_CONFIG } from "@/features/popular-organizations/config/popular-organization.constants";

const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

export async function PopularOrganizationPageContainer({ searchParams }) {
  let orgsData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : POPULAR_ORGANIZATION_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    orgsData = await fetchPopularOrganizationsList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading popular organizations data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{POPULAR_ORGANIZATION_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <PopularOrganizationTable 
          data={orgsData.items} 
          pagination={{
            page: orgsData.page,
            pageSize: orgsData.pageSize,
            totalPages: orgsData.totalPages,
            totalCount: orgsData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
