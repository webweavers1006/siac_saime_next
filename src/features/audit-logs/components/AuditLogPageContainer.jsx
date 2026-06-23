import { Suspense } from "react";
import { fetchAuditLogsList } from "@/features/audit-logs/services/audit-log.read.service";
import { AuditLogTable } from "@/features/audit-logs/components/AuditLogTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { logger } from "@/features/shared/lib/logger";
import { AUDIT_LOG_CONFIG } from "@/features/audit-logs/config/audit-log.constants";

const { LABELS } = AUDIT_LOG_CONFIG.UI;

export async function AuditLogPageContainer({ searchParams }) {
  let auditData;

  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "createdAt";
    const sortDirection = params.sortDirection || "desc";
    const page = params.page ? Number(params.page) : 1;
    const pageSize = params.pageSize ? Number(params.pageSize) : AUDIT_LOG_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const searchTerm = params.q || "";

    auditData = await fetchAuditLogsList({
      page,
      pageSize,
      searchTerm,
      sortKey,
      sortDirection,
    });
  } catch (error) {
    logger.error("Error loading audit logs", { error: error.message });
    return <ErrorAlert title="Error" message={LABELS.MESSAGES.ERROR.LOAD} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{AUDIT_LOG_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">{LABELS.DESCRIPTION}</p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <AuditLogTable
          data={auditData.items}
          pagination={{
            page: auditData.page,
            pageSize: auditData.pageSize,
            totalPages: auditData.totalPages,
            totalCount: auditData.totalCount,
          }}
        />
      </Suspense>
    </div>
  );
}
