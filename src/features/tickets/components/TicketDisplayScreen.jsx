"use client";

import { useEffect, useState } from "react";
import { Monitor, Clock, Users, CheckCircle, Wifi, WifiOff, ArrowRight } from "lucide-react";
import { useTicketSSE } from "../hooks/use-ticket-sse";
import { TICKET_CONFIG } from "../config/ticket.constants";

/**
 * Public display screen for TV/lobby.
 * Shows current tickets being served + waiting count.
 * Connects via SSE to auto-update in real time.
 */
export default function TicketDisplayScreen({ officeId, officeName }) {
  const url = `/api/tickets/events?officeId=${officeId}&role=display`;
  const { lastEvent, isConnected } = useTicketSSE({ url });

  const [display, setDisplay] = useState({
    activeTickets: [],
    waitingTickets: [],
    waitingCount: 0,
    attendedToday: 0,
  });

  useEffect(() => {
    if (lastEvent?.activeTickets) {
      setDisplay({
        activeTickets: lastEvent.activeTickets || [],
        waitingTickets: lastEvent.waitingTickets || [],
        waitingCount: lastEvent.waitingCount || 0,
        attendedToday: lastEvent.attendedToday || 0,
      });
    }
  }, [lastEvent]);

  const { LABELS } = TICKET_CONFIG.UI;
  const { activeTickets, waitingTickets, waitingCount, attendedToday } = display;

  const avgWait = attendedToday > 0
    ? Math.max(1, Math.round(waitingCount / Math.max(attendedToday, 1)) * 5)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-blue-950/80 border-b border-blue-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor className="h-8 w-8 text-yellow-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{LABELS.DISPLAY.TITLE}</h1>
            <p className="text-sm text-blue-300">{officeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {isConnected ? (
            <span className="flex items-center gap-1 text-green-400"><Wifi className="h-4 w-4" /> En vivo</span>
          ) : (
            <span className="flex items-center gap-1 text-red-400"><WifiOff className="h-4 w-4" /> Sin conexión</span>
          )}
          <span className="text-blue-300 text-lg font-mono">
            {new Date().toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </header>

      <div className="flex-1 flex gap-0">
        {/* Now Serving — Left side (2/3) */}
        <section className="flex-[2] flex flex-col items-center justify-center px-8 py-8">
          <h2 className="text-xl font-semibold text-yellow-400 mb-8 flex items-center gap-2">
            <Users className="h-6 w-6" />
            {LABELS.DISPLAY.NOW_SERVING}
          </h2>

          {activeTickets.length === 0 ? (
            <p className="text-blue-300 text-2xl">{LABELS.DISPLAY.EMPTY}</p>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center">
              {activeTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-blue-800/60 border-2 border-yellow-400/50 rounded-2xl p-8 min-w-[220px] text-center animate-pulse"
                >
                  <p className="text-6xl font-black text-yellow-400 mb-3">{ticket.ticketNumber}</p>
                  <p className="text-lg text-blue-200 mb-2">
                    {ticket.status === "CALLED" ? "🔔 Llamando..." : "🟢 En Atención"}
                  </p>
                  {ticket.deskNumber ? (
                    <p className="text-3xl font-bold text-white mt-2">Taquilla {ticket.deskNumber}</p>
                  ) : (
                    <p className="text-lg text-yellow-300/70 mt-2">—</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Next in line — Right sidebar (1/3) */}
        <aside className="flex-1 bg-blue-950/50 border-l border-blue-800 px-6 py-8 flex flex-col">
          <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Próximos en la cola
          </h3>

          {waitingTickets.length === 0 ? (
            <p className="text-blue-400/60 text-sm">—</p>
          ) : (
            <ul className="space-y-2 flex-1 overflow-auto">
              {waitingTickets.slice(0, 15).map((ticket, i) => (
                <li
                  key={ticket.id}
                  className="flex items-center gap-3 text-sm bg-blue-800/30 rounded-lg px-4 py-2"
                >
                  <span className="text-blue-400 font-mono w-6">{i + 1}.</span>
                  <span className="font-bold text-white text-lg">{ticket.ticketNumber}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* Stats footer */}
      <footer className="bg-blue-950/90 border-t border-blue-800 px-8 py-4 flex items-center justify-around">
        <div className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-blue-400" />
          <span className="text-blue-300">
            {LABELS.DISPLAY.WAITING}: <strong className="text-white text-xl">{waitingCount}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className="text-blue-300">
            {LABELS.DISPLAY.ATTENDED_TODAY}: <strong className="text-white text-xl">{attendedToday}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-yellow-400" />
          <span className="text-blue-300">
            {LABELS.DISPLAY.AVG_WAIT_TIME}: <strong className="text-white text-xl">~{avgWait} min</strong>
          </span>
        </div>
      </footer>
    </div>
  );
}
