import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { PersonPageContainer } from "@/features/persons/components/PersonPageContainer";
import { PERSON_CONFIG } from "@/features/persons";

const { LABELS } = PERSON_CONFIG.UI;

export const metadata = {
  title: `${PERSON_CONFIG.TITLE} | Sistema`,
  description: LABELS.DESCRIPTION,
};

export default async function PersonsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(PERSON_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <PersonPageContainer searchParams={searchParams} />;
}
