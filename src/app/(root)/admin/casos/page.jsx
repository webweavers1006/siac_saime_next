import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CasePageContainer } from "@/features/cases/components/CasePageContainer";
import { CASE_CONFIG } from "@/features/cases";

const { LABELS } = CASE_CONFIG.UI;

export const metadata = {
  title: `${CASE_CONFIG.TITLE} | Sistema`,
  description: LABELS.DESCRIPTION,
};

export default async function CasesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(CASE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <CasePageContainer searchParams={searchParams} />;
}
