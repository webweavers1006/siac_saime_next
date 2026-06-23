import { Suspense } from "react";
import { logger } from "@/features/shared/lib/logger";
import { fetchAttentionTypeDetailsList } from "@/features/attention-type-details/services/attention-type-detail.read.service";
import { AttentionTypeDetailTable } from "@/features/attention-type-details/components/AttentionTypeDetailTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "@/features/attention-type-details/config/attention-type-detail.constants";

const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

export async function AttentionTypeDetailPageContainer({ searchParams }) {
  let detailData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : ATTENTION_TYPE_DETAIL_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    detailData = await fetchAttentionTypeDetailsList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading attention type details data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{ATTENTION_TYPE_DETAIL_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <AttentionTypeDetailTable
          data={detailData.items}
          pagination={{
            page: detailData.page,
            pageSize: detailData.pageSize,
            totalPages: detailData.totalPages,
            totalCount: detailData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
