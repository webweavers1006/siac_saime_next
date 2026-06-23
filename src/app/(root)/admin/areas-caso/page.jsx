import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CaseAreaPageContainer } from "@/features/case-areas/components/CaseAreaPageContainer";
import { CASE_AREA_CONFIG } from "@/features/case-areas";

const { LABELS } = CASE_AREA_CONFIG.UI;

export const metadata = {
  title: `${CASE_AREA_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function CaseAreasPage({ searchParams }) {
  const { authorized } = await checkPageAccess(CASE_AREA_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <CaseAreaPageContainer searchParams={searchParams} />;
}
