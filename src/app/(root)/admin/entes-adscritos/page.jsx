import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AttachedEntityPageContainer } from "@/features/attached-entities/components/AttachedEntityPageContainer";
import { ATTACHED_ENTITY_CONFIG } from "@/features/attached-entities";

const { LABELS } = ATTACHED_ENTITY_CONFIG.UI;

export const metadata = {
  title: `${ATTACHED_ENTITY_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function AttachedEntitiesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ATTACHED_ENTITY_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AttachedEntityPageContainer searchParams={searchParams} />;
}
