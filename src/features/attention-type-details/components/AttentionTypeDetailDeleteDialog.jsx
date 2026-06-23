"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteAttentionTypeDetailAction } from "../actions/attention-type-detail.write.action";
import { ATTENTION_TYPE_DETAIL_CONFIG } from "../config/attention-type-detail.constants";

export function AttentionTypeDetailDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteAttentionTypeDetailAction(item.id);
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
