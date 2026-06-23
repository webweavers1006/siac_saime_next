"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteAttachedEntityAction } from "../actions/attached-entity.write.action";
import { ATTACHED_ENTITY_CONFIG } from "../config/attached-entity.constants";

export function AttachedEntityDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = ATTACHED_ENTITY_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteAttachedEntityAction(item.id);
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
