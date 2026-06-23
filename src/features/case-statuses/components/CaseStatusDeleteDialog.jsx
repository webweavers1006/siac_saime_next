"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteCaseStatusAction } from "../actions/case-status.write.action";
import { CASE_STATUS_CONFIG } from "../config/case-status.constants";

export function CaseStatusDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = CASE_STATUS_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteCaseStatusAction(item.id);
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
