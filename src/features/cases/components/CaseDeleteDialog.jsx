"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteCaseAction } from "../actions/case.write.action";
import { CASE_CONFIG } from "../config/case.constants";

export function CaseDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = CASE_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteCaseAction(item.id);
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
