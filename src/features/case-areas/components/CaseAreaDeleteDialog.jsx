"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteCaseAreaAction } from "../actions/case-area.write.action";
import { CASE_AREA_CONFIG } from "../config/case-area.constants";

export function CaseAreaDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = CASE_AREA_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteCaseAreaAction(item.id);
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
