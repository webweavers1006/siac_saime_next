import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchPersonsList } from "@/features/persons/services/person.read.service";
import { PersonTable } from "@/features/persons/components/PersonTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { PERSON_CONFIG } from "@/features/persons/config/person.constants";

const { LABELS } = PERSON_CONFIG.UI;

export async function PersonPageContainer({ searchParams }) {
  let personsData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "firstName";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : PERSON_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    personsData = await fetchPersonsList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading persons data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{PERSON_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <PersonTable
          data={personsData.items}
          pagination={{
            page: personsData.page,
            pageSize: personsData.pageSize,
            totalPages: personsData.totalPages,
            totalCount: personsData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
