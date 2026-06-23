"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteBeneficiaryTypeAction } from "../actions/beneficiary-type.write.action";
import { BENEFICIARY_TYPE_CONFIG } from "../config/beneficiary-type.constants";

export function BeneficiaryTypeDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteBeneficiaryTypeAction(item.id);
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
