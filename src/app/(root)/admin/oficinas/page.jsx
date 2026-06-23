import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { OfficePageContainer } from "@/features/offices/components/OfficePageContainer";
import { OFFICE_CONFIG } from "@/features/offices";

const { LABELS } = OFFICE_CONFIG.UI;

export const metadata = {
  title: `${OFFICE_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function OfficesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(OFFICE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <OfficePageContainer searchParams={searchParams} />;
}
