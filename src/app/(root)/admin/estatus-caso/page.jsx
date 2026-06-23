import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CaseStatusPageContainer } from "@/features/case-statuses/components/CaseStatusPageContainer";
import { CASE_STATUS_CONFIG } from "@/features/case-statuses";

const { LABELS } = CASE_STATUS_CONFIG.UI;

export const metadata = {
  title: `${CASE_STATUS_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function CaseStatusesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(CASE_STATUS_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <CaseStatusPageContainer searchParams={searchParams} />;
}
