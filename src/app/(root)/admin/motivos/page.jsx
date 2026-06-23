import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { ReasonPageContainer } from "@/features/reasons/components/ReasonPageContainer";
import { REASON_CONFIG } from "@/features/reasons";

const { LABELS } = REASON_CONFIG.UI;

export const metadata = {
  title: `${REASON_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function ReasonsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(REASON_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <ReasonPageContainer searchParams={searchParams} />;
}
