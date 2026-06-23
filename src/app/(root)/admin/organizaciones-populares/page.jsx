import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { PopularOrganizationPageContainer } from "@/features/popular-organizations/components/PopularOrganizationPageContainer";
import { POPULAR_ORGANIZATION_CONFIG } from "@/features/popular-organizations";

const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

export const metadata = {
  title: `${POPULAR_ORGANIZATION_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function PopularOrganizationsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(POPULAR_ORGANIZATION_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <PopularOrganizationPageContainer searchParams={searchParams} />;
}
