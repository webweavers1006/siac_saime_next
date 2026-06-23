"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteReasonAction } from "../actions/reason.write.action";
import { REASON_CONFIG } from "../config/reason.constants";

export function ReasonDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = REASON_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteReasonAction(item.id);
    if (result.success) {
      toast.success(result.message);
      onSuccess?.();
    } else {
      toast.error(result.error);
    }
    onOpenChange(false);
  };

  return (
    <DeleteConfirmDialog
      isOpen={!!item}
      onConfirm={handleDelete}
      onCancel={() => onOpenChange(false)}
      title={LABELS.FORM.DELETE_DIALOG.TITLE}
      description={LABELS.FORM.DELETE_DIALOG.DESCRIPTION}
    />
  );
}
