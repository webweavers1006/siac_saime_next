"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deletePersonAction } from "../actions/person.write.action";
import { PERSON_CONFIG } from "../config/person.constants";

export function PersonDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = PERSON_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deletePersonAction(item.id);
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
