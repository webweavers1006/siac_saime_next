import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { TicketPageContainer } from "@/features/tickets/components/TicketPageContainer";
import { TICKET_CONFIG } from "@/features/tickets";

const { LABELS } = TICKET_CONFIG.UI;

export const metadata = {
  title: `${TICKET_CONFIG.TITLE} | Admin Starter`,
  description: LABELS.DESCRIPTION,
};

export default async function TicketsPage({ searchParams }) {
  const { authorized, session } = await checkPageAccess(TICKET_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <TicketPageContainer searchParams={searchParams} session={session} />;
}
