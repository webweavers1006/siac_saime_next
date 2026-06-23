"use client";

import dynamic from "next/dynamic";

/**
 * Client wrapper for the display screen.
 * Uses next/dynamic with ssr:false because Leaflet/SSE are client-only.
 */
const TicketDisplayScreen = dynamic(() => import("./TicketDisplayScreen"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-blue-950 flex items-center justify-center">
      <p className="text-blue-300 text-xl animate-pulse">Cargando panel de turnos...</p>
    </div>
  ),
});

export default function TicketDisplayWrapper({ officeId, officeName }) {
  return <TicketDisplayScreen officeId={officeId} officeName={officeName} />;
}
