"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteAttentionChannelAction } from "../actions/attention-channel.write.action";
import { ATTENTION_CHANNEL_CONFIG } from "../config/attention-channel.constants";

export function AttentionChannelDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = ATTENTION_CHANNEL_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteAttentionChannelAction(item.id);
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
