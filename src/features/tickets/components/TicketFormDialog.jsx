"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TicketGeneratorForm from "./TicketGeneratorForm";
import { TICKET_CONFIG } from "../config/ticket.constants";

export function TicketFormDialog({ open, onOpenChange, onSuccess }) {
  const { LABELS } = TICKET_CONFIG.UI;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{LABELS.FORM.SUBMIT}</DialogTitle>
        </DialogHeader>
        <TicketGeneratorForm
          isPublic={false}
          onSuccess={(data) => {
            onOpenChange(false);
            onSuccess?.(data);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
