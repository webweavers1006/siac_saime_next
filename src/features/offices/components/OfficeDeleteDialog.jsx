"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteOfficeAction } from "../actions/offices.write.action";
import { OFFICE_CONFIG } from "../config/offices.constants";

export function OfficeDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = OFFICE_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteOfficeAction(item.id);
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
