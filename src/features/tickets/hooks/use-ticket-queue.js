"use client";

import { useState, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { callNextAction, updateTicketStatusAction, cancelTicketAction } from "../actions/ticket.write.action";
import { TICKET_CONFIG } from "../config/ticket.constants";

/**
 * Hook for managing an advisor's ticket queue.
 *
 * @param {Object} options
 * @param {Object} options.initialData - Initial queue data from SSE
 * @param {number} options.officeId - The advisor's office
 * @returns {Object} queue state + action handlers
 */
export function useTicketQueue({ initialData, officeId }) {
  const [isPending, startTransition] = useTransition();
  const [currentTicket, setCurrentTicket] = useState(initialData?.currentTicket || null);
  const [waitingTickets, setWaitingTickets] = useState(initialData?.waitingTickets || []);

  const handleCallNext = useCallback((deskNumber, serviceType) => {
    startTransition(async () => {
      const result = await callNextAction({ officeId, deskNumber, serviceType });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || TICKET_CONFIG.UI.LABELS.MESSAGES.ERROR.CALL);
      }
    });
  }, [officeId]);

  const handleStartAttention = useCallback((ticketId) => {
    startTransition(async () => {
      const result = await updateTicketStatusAction({
        id: ticketId,
        status: TICKET_CONFIG.STATUS.IN_ATTENTION,
      });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }, []);

  const handleFinish = useCallback((ticketId) => {
    startTransition(async () => {
      const result = await updateTicketStatusAction({
        id: ticketId,
        status: TICKET_CONFIG.STATUS.FINISHED,
      });
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }, []);

  const handleNoShow = useCallback((ticketId) => {
    startTransition(async () => {
      const result = await cancelTicketAction(ticketId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
    });
  }, []);

  return {
    currentTicket,
    waitingTickets,
    isPending,
    setCurrentTicket,
    setWaitingTickets,
    handleCallNext,
    handleStartAttention,
    handleFinish,
    handleNoShow,
  };
}
