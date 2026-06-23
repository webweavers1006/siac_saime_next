import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AttentionTypeDetailPageContainer } from "@/features/attention-type-details/components/AttentionTypeDetailPageContainer";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "@/features/attention-type-details";

const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

export const metadata = {
  title: `${ATTENTION_TYPE_DETAIL_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function AttentionTypeDetailsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ATTENTION_TYPE_DETAIL_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AttentionTypeDetailPageContainer searchParams={searchParams} />;
}
