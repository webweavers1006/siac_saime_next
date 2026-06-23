"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AttentionTypeDetailForm } from "./AttentionTypeDetailForm";
import { AttentionTypeDetailDeleteDialog } from "./AttentionTypeDetailDeleteDialog";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "../config/attention-type-detail.constants";

export function AttentionTypeDetailTableDialogs({
  open,
  onOpenChange,
  editingItem,
  deletingItem,
  setDeletingItem,
  onSuccess
}) {
  const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <AttentionTypeDetailForm
            defaultValues={editingItem}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <AttentionTypeDetailDeleteDialog
        item={deletingItem}
        onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
