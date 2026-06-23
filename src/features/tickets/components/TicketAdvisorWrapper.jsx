"use client";

import TicketAdvisorPanel from "./TicketAdvisorPanel";

export default function TicketAdvisorWrapper({ userId, officeId, deskNumber }) {
  return <TicketAdvisorPanel userId={userId} officeId={officeId} deskNumber={deskNumber} />;
}
