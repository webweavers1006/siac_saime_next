"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteAttentionTypeAction } from "../actions/attention-type.write.action";
import { ATTENTION_TYPE_CONFIG } from "../config/attention-type.constants";

export function AttentionTypeDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = ATTENTION_TYPE_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteAttentionTypeAction(item.id);
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
