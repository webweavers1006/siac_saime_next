import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AttentionChannelPageContainer } from "@/features/attention-channels/components/AttentionChannelPageContainer";
import { ATTENTION_CHANNEL_CONFIG } from "@/features/attention-channels";

const { LABELS } = ATTENTION_CHANNEL_CONFIG.UI;

export const metadata = {
  title: `${ATTENTION_CHANNEL_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function AttentionChannelsPage({ searchParams }) {
  const { authorized } = await checkPageAccess(ATTENTION_CHANNEL_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AttentionChannelPageContainer searchParams={searchParams} />;
}
