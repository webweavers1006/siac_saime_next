import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { CaseCoordinatePageContainer } from "@/features/case-coordinates/components/CaseCoordinatePageContainer";
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates";

const { LABELS } = CASE_COORDINATE_CONFIG.UI;

export const metadata = {
  title: `${CASE_COORDINATE_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function CaseCoordinatesMapPage({ searchParams }) {
  const { authorized } = await checkPageAccess(CASE_COORDINATE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <CaseCoordinatePageContainer searchParams={searchParams} />;
}
