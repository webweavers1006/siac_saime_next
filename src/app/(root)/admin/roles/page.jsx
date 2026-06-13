import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { RolePageContainer } from "@/features/roles/components/RolePageContainer";
import { ROLE_CONFIG } from "@/features/roles";

const { LABELS } = ROLE_CONFIG.UI;

export const metadata = {
  title: `${ROLE_CONFIG.TITLE} | Sistema`,
  description: LABELS.DESCRIPTION,
};

export default async function RolesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ROLE_CONFIG.PERMISSIONS.READ);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <RolePageContainer searchParams={searchParams} />;
}
