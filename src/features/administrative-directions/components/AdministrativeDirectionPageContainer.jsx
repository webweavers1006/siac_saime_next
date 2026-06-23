import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchAdministrativeDirectionsList } from "@/features/administrative-directions/services/administrative-direction.read.service";
import { AdministrativeDirectionTable } from "@/features/administrative-directions/components/AdministrativeDirectionTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "@/features/administrative-directions/config/administrative-direction.constants";
import { caseAreaReadRepository } from "@/features/case-areas/repositories/case-area.read.repository";
import { caseAreaMapper } from "@/features/case-areas/mappers/case-area.mapper";

const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

export async function AdministrativeDirectionPageContainer({ searchParams }) {
  let administrativeDirectionsData;
  let allAreas = [];
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : ADMINISTRATIVE_DIRECTION_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    const [directionsResult, areasResult] = await Promise.all([
      fetchAdministrativeDirectionsList({ page, pageSize, searchTerm, sortKey, sortDirection }),
      caseAreaReadRepository.findMany({ page: 1, pageSize: 100, sortKey: "name", sortDirection: "asc" }),
    ]);

    administrativeDirectionsData = directionsResult;
    allAreas = caseAreaMapper.toDomainList(areasResult.items);
  } catch (error) {
    logger.error("Error loading administrative directions data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{ADMINISTRATIVE_DIRECTION_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <AdministrativeDirectionTable 
          data={administrativeDirectionsData.items} 
          allAreas={allAreas}
          pagination={{
            page: administrativeDirectionsData.page,
            pageSize: administrativeDirectionsData.pageSize,
            totalPages: administrativeDirectionsData.totalPages,
            totalCount: administrativeDirectionsData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
