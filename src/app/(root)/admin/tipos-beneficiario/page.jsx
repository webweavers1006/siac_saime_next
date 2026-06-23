import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { BeneficiaryTypePageContainer } from "@/features/beneficiary-types/components/BeneficiaryTypePageContainer";
import { BENEFICIARY_TYPE_CONFIG } from "@/features/beneficiary-types";

const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

export const metadata = {
  title: `${BENEFICIARY_TYPE_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function BeneficiaryTypesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(BENEFICIARY_TYPE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <BeneficiaryTypePageContainer searchParams={searchParams} />;
}
