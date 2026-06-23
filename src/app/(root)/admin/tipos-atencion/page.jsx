import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AttentionTypePageContainer } from "@/features/attention-types/components/AttentionTypePageContainer";
import { ATTENTION_TYPE_CONFIG } from "@/features/attention-types";

const { LABELS } = ATTENTION_TYPE_CONFIG.UI;

export const metadata = {
  title: `${ATTENTION_TYPE_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function AttentionTypesPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ATTENTION_TYPE_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AttentionTypePageContainer searchParams={searchParams} />;
}
