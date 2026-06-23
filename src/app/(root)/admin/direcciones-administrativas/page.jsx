import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AdministrativeDirectionPageContainer } from "@/features/administrative-directions/components/AdministrativeDirectionPageContainer";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "@/features/administrative-directions";

const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

export const metadata = {
  title: `${ADMINISTRATIVE_DIRECTION_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function AdministrativeDirectionsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ADMINISTRATIVE_DIRECTION_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AdministrativeDirectionPageContainer searchParams={searchParams} />;
}
