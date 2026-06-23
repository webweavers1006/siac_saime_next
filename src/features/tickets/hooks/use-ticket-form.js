"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { createTicketSchema } from "../schemas/ticket.schema";
import { createTicketAction, createPublicTicketAction } from "../actions/ticket.write.action";

/**
 * Hook for the ticket creation form.
 *
 * @param {Object} options
 * @param {Function} options.onSuccess - Called after successful creation
 * @param {boolean} [options.isPublic=false] - Use public action (no auth required)
 * @returns {Object} form state + submit handler
 */
export function useTicketForm({ onSuccess, isPublic = false }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      attentionTypeId: null,
      officeId: null,
      serviceType: null,
      personId: null,
      personIdCard: "",
      personFirstName: "",
      personLastName: "",
      personPhone: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const action = isPublic ? createPublicTicketAction : createTicketAction;
      const result = await action(data);

      if (result.success) {
        toast.success(result.message || "Turno generado.");
        form.reset();
        onSuccess?.(result.data);
      } else {
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            form.setError(field, { type: "server", message: messages[0] });
          });
        } else {
          toast.error(result.error || "Error al generar turno.");
        }
      }
    });
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
