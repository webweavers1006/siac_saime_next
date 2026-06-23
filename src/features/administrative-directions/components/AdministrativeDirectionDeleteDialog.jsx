"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deleteAdministrativeDirectionAction } from "../actions/administrative-direction.write.action";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";

export function AdministrativeDirectionDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deleteAdministrativeDirectionAction(item.id);
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
