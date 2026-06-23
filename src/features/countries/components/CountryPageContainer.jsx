import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchCountriesList } from "@/features/countries/services/country.read.service";
import { CountryTable } from "@/features/countries/components/CountryTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { COUNTRY_CONFIG } from "@/features/countries/config/country.constants";

const { LABELS } = COUNTRY_CONFIG.UI;

export async function CountryPageContainer({ searchParams }) {
  let countriesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : COUNTRY_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    countriesData = await fetchCountriesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading countries data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{COUNTRY_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CountryTable 
          data={countriesData.items} 
          pagination={{
            page: countriesData.page,
            pageSize: countriesData.pageSize,
            totalPages: countriesData.totalPages,
            totalCount: countriesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
