import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { SentEmailPageContainer } from "@/features/sent-emails/components/SentEmailPageContainer";
import { SENT_EMAIL_CONFIG } from "@/features/sent-emails";

export const metadata = {
  title: `${SENT_EMAIL_CONFIG.TITLE} | Sistema`,
};

export default async function SentEmailPage({ searchParams }) {
  const { authorized } = await checkPageAccess(SENT_EMAIL_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <SentEmailPageContainer searchParams={searchParams} />;
}
