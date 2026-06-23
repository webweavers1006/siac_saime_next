import { logger } from "@/features/shared";
import { Suspense } from "react";
import { fetchAttentionChannelsList } from "@/features/attention-channels/services/attention-channel.read.service";
import { AttentionChannelTable } from "@/features/attention-channels/components/AttentionChannelTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { ATTENTION_CHANNEL_CONFIG } from "@/features/attention-channels/config/attention-channel.constants";

const { LABELS } = ATTENTION_CHANNEL_CONFIG.UI;

export async function AttentionChannelPageContainer({ searchParams }) {
  let networksData;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || "asc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : ATTENTION_CHANNEL_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    networksData = await fetchAttentionChannelsList({ page, pageSize, searchTerm, sortKey, sortDirection });
  } catch (error) {
    logger.error("Error loading social networks data:", error);
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
        <h1 className="text-3xl font-bold tracking-tight">{ATTENTION_CHANNEL_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <AttentionChannelTable 
          data={networksData.items} 
          pagination={{
            page: networksData.page,
            pageSize: networksData.pageSize,
            totalPages: networksData.totalPages,
            totalCount: networksData.totalCount
          }}
        />
      </Suspense>
    </div>
  );
}
