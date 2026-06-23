"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReasonForm } from "./ReasonForm";
import { ReasonDeleteDialog } from "./ReasonDeleteDialog";
import { REASON_CONFIG } from "../config/reason.constants";

export function ReasonTableDialogs({
  open,
  onOpenChange,
  editingItem,
  deletingItem,
  setDeletingItem,
  onSuccess
}) {
  const { LABELS } = REASON_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <ReasonForm
            defaultValues={editingItem}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <ReasonDeleteDialog
        item={deletingItem}
        onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
