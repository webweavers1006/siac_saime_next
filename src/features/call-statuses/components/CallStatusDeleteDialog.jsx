"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteCallStatusAction } from "../actions/call-status.write.action";
import { CALL_STATUS_CONFIG } from "../config/call-status.constants";

export function CallStatusDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = CALL_STATUS_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteCallStatusAction(item.id);
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
