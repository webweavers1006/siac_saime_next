"use client";

import { useEffect, useState } from "react";
import { PhoneCall, Play, CheckCircle, UserX, Clock, AlertCircle } from "lucide-react";
import { useTicketSSE } from "../hooks/use-ticket-sse";
import { useTicketQueue } from "../hooks/use-ticket-queue";
import { TICKET_CONFIG } from "../config/ticket.constants";

export default function TicketAdvisorPanel({ userId, officeId, deskNumber: initialDesk }) {
  const [deskNumber, setDeskNumber] = useState(initialDesk || "");
  const [filterService, setFilterService] = useState("");
  const [officeCapabilities, setOfficeCapabilities] = useState(null);
  const url = `/api/tickets/events?role=advisor`;
  const { lastEvent } = useTicketSSE({ url, enabled: !!userId });

  useEffect(() => {
    if (officeId) {
      import("@/features/offices/actions/office-capabilities.action")
        .then(m => m.getOfficeCapabilitiesAction(officeId))
        .then(setOfficeCapabilities);
    }
  }, [officeId]);

  const {
    currentTicket,
    waitingTickets,
    isPending,
    setCurrentTicket,
    setWaitingTickets,
    handleCallNext,
    handleStartAttention,
    handleFinish,
    handleNoShow,
  } = useTicketQueue({ officeId });

  useEffect(() => {
    if (lastEvent?.currentTicket !== undefined) {
      setCurrentTicket(lastEvent.currentTicket);
    }
    if (lastEvent?.waitingTickets) {
      setWaitingTickets(lastEvent.waitingTickets);
    }
  }, [lastEvent, setCurrentTicket, setWaitingTickets]);

  const { LABELS } = TICKET_CONFIG.UI;

  if (!officeId) {
    return (
      <div className="border rounded-xl p-4 bg-card text-center">
        <p className="text-sm text-muted-foreground">
          No tienes una oficina asignada. Ve a <strong>Usuarios</strong> y edita tu perfil para asignar una oficina.
        </p>
      </div>
    );
  }

  const displayUrl = `/turnos?oficina=${officeId}`;
  const formUrl = `/tomar-turno?oficina=${officeId}`;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Current ticket */}
      <div className="border rounded-xl p-4 bg-card">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {LABELS.ADVISOR.CURRENT_TICKET}
        </h3>
        {currentTicket ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-primary">{currentTicket.ticketNumber}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {TICKET_CONFIG.STATUS_LABELS[currentTicket.status]}
              </span>
            </div>
            {currentTicket.personFirstName && (
              <p className="text-sm text-muted-foreground">
                {currentTicket.personFirstName} {currentTicket.personLastName || ""}
                {currentTicket.personIdCard && ` — CI: ${currentTicket.personIdCard}`}
              </p>
            )}
            {currentTicket.serviceType && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {currentTicket.serviceType === "FOREIGN_AFFAIRS" ? "Extranjería"
                  : currentTicket.serviceType === "MIGRATION" ? "Migración"
                  : currentTicket.serviceType === "EMAIL_CHANGE" ? "Cambio de Correo"
                  : currentTicket.serviceType === "GENERAL" ? "General"
                  : currentTicket.serviceType}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {currentTicket.status === "CALLED" && (
                <>
                  <button
                    onClick={() => handleStartAttention(currentTicket.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {LABELS.ADVISOR.START_ATTENTION}
                  </button>
                  <button
                    onClick={() => handleNoShow(currentTicket.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    {LABELS.ADVISOR.NO_SHOW}
                  </button>
                </>
              )}
              {currentTicket.status === "IN_ATTENTION" && (
                <button
                  onClick={() => handleFinish(currentTicket.id)}
                  disabled={isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {LABELS.ADVISOR.FINISH}
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{LABELS.ADVISOR.NO_TICKETS}</p>
        )}
      </div>

      {/* Service filter + Desk number + Call next */}
      <div className="space-y-2">
        {officeCapabilities && (
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Todos los servicios</option>
            {officeCapabilities.hasForeignAffairs && <option value="FOREIGN_AFFAIRS">Extranjería</option>}
            {officeCapabilities.hasMigration && <option value="MIGRATION">Migración</option>}
            {officeCapabilities.hasEmailChange && <option value="EMAIL_CHANGE">Cambio de Correo</option>}
            <option value="GENERAL">Atención General</option>
          </select>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={deskNumber}
            onChange={(e) => setDeskNumber(e.target.value)}
            placeholder={LABELS.FORM.PLACEHOLDERS.DESK_NUMBER}
            className="w-24 px-3 py-2 border rounded-lg text-sm text-center"
            maxLength={10}
          />
          <button
            onClick={() => handleCallNext(deskNumber || null, filterService || null)}
            disabled={isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 text-lg font-semibold"
          >
            <PhoneCall className="h-5 w-5" />
            {LABELS.ADVISOR.CALL_NEXT}
          </button>
        </div>
      </div>

      {/* Waiting queue */}
      <div className="border rounded-xl p-4 bg-card flex-1 overflow-auto">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          {LABELS.ADVISOR.MY_QUEUE}
          {waitingTickets.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
              {waitingTickets.length}
            </span>
          )}
        </h3>
        {waitingTickets.length === 0 ? (
          <p className="text-xs text-muted-foreground">{LABELS.ADVISOR.NO_TICKETS}</p>
        ) : (
          <ul className="space-y-1">
            {waitingTickets.map((ticket) => (
              <li key={ticket.id} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-muted/50">
                <span className="font-mono font-semibold">{ticket.ticketNumber}</span>
                <span className="text-xs text-muted-foreground">
                  {ticket.personFirstName || "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Public links */}
      <div className="border rounded-xl p-3 bg-card text-xs space-y-2">
        <p className="font-semibold text-muted-foreground">🔗 Links públicos</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">📱 Tomar turno (QR):</span>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.origin + formUrl)}
              className="text-primary hover:underline text-xs"
            >
              Copiar link
            </button>
          </div>
          <a href={formUrl} target="_blank" className="text-primary hover:underline block" rel="noopener noreferrer">
            {formUrl}
          </a>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">📺 Pantalla lobby:</span>
            <button
              onClick={() => navigator.clipboard.writeText(window.location.origin + displayUrl)}
              className="text-primary hover:underline text-xs"
            >
              Copiar link
            </button>
          </div>
          <a href={displayUrl} target="_blank" className="text-primary hover:underline block" rel="noopener noreferrer">
            {displayUrl}
          </a>
        </div>
      </div>
    </div>
  );
}
