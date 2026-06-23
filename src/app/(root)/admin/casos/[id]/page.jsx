import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CaseDetailPageContainer } from "@/features/cases/components/CaseDetailPageContainer";
import { CASE_CONFIG } from "@/features/cases";

const { LABELS } = CASE_CONFIG.UI;

export const metadata = {
  title: `Detalle de Caso | Sistema`,
  description: LABELS.DESCRIPTION,
};

export default async function CaseDetailPage({ params }) {
  const { authorized } = await checkPageAccess(CASE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  const { id } = await params;
  return <CaseDetailPageContainer caseId={id} />;
}
