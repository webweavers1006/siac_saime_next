import TicketDisplayWrapper from "@/features/tickets/components/TicketDisplayWrapper";
import { getOfficesForSelectAction } from "@/features/offices/actions/offices.select.action";

/**
 * Public display page — no auth required.
 * Shows the ticket display for a given office (via QR scan or direct URL).
 * URL: /turnos?oficina=ID
 */
export default async function DisplayPage({ searchParams }) {
  const params = (await searchParams) || {};
  const officeId = params.oficina ? Number(params.oficina) : null;
  let officeName = "SAIME";

  if (officeId) {
    const offices = await getOfficesForSelectAction({});
    const found = offices.find((o) => o.value === officeId);
    if (found) officeName = found.label;
  }

  return <TicketDisplayWrapper officeId={officeId} officeName={officeName} />;
}
