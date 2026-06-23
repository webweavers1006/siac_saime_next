import { Suspense } from "react";
import { fetchCaseById } from "@/features/cases/services/case.read.service";
import { fetchCaseDocumentsByCaseId } from "@/features/case-documents/services/case-document.read.service";
import { CaseDetailView } from "./CaseDetailView";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { logger } from "@/features/shared/lib/logger";
import { CASE_CONFIG } from "@/features/cases/config/case.constants";
import { getSession } from "@/features/auth/lib/auth";
import { registerCaseView } from "@/features/audit-logs/services/audit-log.write.service";

export async function CaseDetailPageContainer({ caseId }) {
  let caseData;
  let documents = [];

  try {
    const id = Number(caseId);
    if (isNaN(id) || id < 1) {
      return <ErrorAlert title="Error" message="ID de caso inválido." />;
    }

    [caseData, documents] = await Promise.all([
      fetchCaseById(id),
      fetchCaseDocumentsByCaseId(id).catch(() => []),
    ]);

    if (!caseData) {
      return <ErrorAlert title="No encontrado" message="El caso no existe o fue eliminado." />;
    }

    // Register first-time case view in audit log (fire-and-forget)
    const session = await getSession();
    if (session?.id) {
      registerCaseView({
        userId: session.id,
        caseId: id,
        requestNumber: caseData.requestNumber,
      });
    }
  } catch (error) {
    logger.error("Error loading case detail", { error: error.message, caseId });
    return <ErrorAlert title="Error" message={CASE_CONFIG.UI.LABELS.MESSAGES.ERROR.LOAD} />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <a
          href={CASE_CONFIG.PATH}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {CASE_CONFIG.TITLE}
        </a>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-bold tracking-tight">
          {caseData.requestNumber || `Caso #${caseData.id}`}
        </h1>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <CaseDetailView caseData={caseData} documents={documents} />
      </Suspense>
    </div>
  );
}
