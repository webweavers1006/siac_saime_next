import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CallStatusPageContainer } from "@/features/call-statuses/components/CallStatusPageContainer";
import { CALL_STATUS_CONFIG } from "@/features/call-statuses";

const { LABELS } = CALL_STATUS_CONFIG.UI;

export const metadata = {
  title: `${CALL_STATUS_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function CallStatusesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(CALL_STATUS_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <CallStatusPageContainer searchParams={searchParams} />;
}
