import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchAttachedEntitiesList } from "@/features/attached-entities/services/attached-entity.read.service";
import { AttachedEntityTable } from "@/features/attached-entities/components/AttachedEntityTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ATTACHED_ENTITY_CONFIG } from "@/features/attached-entities/config/attached-entity.constants";

const { LABELS } = ATTACHED_ENTITY_CONFIG.UI;

export async function AttachedEntityPageContainer({ searchParams }) {
  let entitiesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : ATTACHED_ENTITY_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    entitiesData = await fetchAttachedEntitiesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading attached entities data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{ATTACHED_ENTITY_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <AttachedEntityTable 
          data={entitiesData.items} 
          pagination={{
            page: entitiesData.page,
            pageSize: entitiesData.pageSize,
            totalPages: entitiesData.totalPages,
            totalCount: entitiesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
