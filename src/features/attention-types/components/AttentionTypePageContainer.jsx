import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchAttentionTypesList } from "@/features/attention-types/services/attention-type.read.service";
import { AttentionTypeTable } from "@/features/attention-types/components/AttentionTypeTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ATTENTION_TYPE_CONFIG } from "@/features/attention-types/config/attention-type.constants";

const { LABELS } = ATTENTION_TYPE_CONFIG.UI;

export async function AttentionTypePageContainer({ searchParams }) {
  let attentionTypesData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : ATTENTION_TYPE_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    attentionTypesData = await fetchAttentionTypesList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading attention types data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{ATTENTION_TYPE_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <AttentionTypeTable 
          data={attentionTypesData.items} 
          pagination={{
            page: attentionTypesData.page,
            pageSize: attentionTypesData.pageSize,
            totalPages: attentionTypesData.totalPages,
            totalCount: attentionTypesData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
