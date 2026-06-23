import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchBeneficiaryTypesList } from "@/features/beneficiary-types/services/beneficiary-type.read.service";
import { BeneficiaryTypeTable } from "@/features/beneficiary-types/components/BeneficiaryTypeTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { BENEFICIARY_TYPE_CONFIG } from "@/features/beneficiary-types/config/beneficiary-type.constants";

const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

export async function BeneficiaryTypePageContainer({ searchParams }) {
  let beneficiaryTypesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : BENEFICIARY_TYPE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    beneficiaryTypesData = await fetchBeneficiaryTypesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading beneficiary types data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{BENEFICIARY_TYPE_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <BeneficiaryTypeTable 
          data={beneficiaryTypesData.items} 
          pagination={{
            page: beneficiaryTypesData.page,
            pageSize: beneficiaryTypesData.pageSize,
            totalPages: beneficiaryTypesData.totalPages,
            totalCount: beneficiaryTypesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
