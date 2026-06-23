"use client";

import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { deletePopularOrganizationAction } from "../actions/popular-organization.write.action";
import { POPULAR_ORGANIZATION_CONFIG } from "../config/popular-organization.constants";

export function PopularOrganizationDeleteDialog({ item, onOpenChange, onSuccess }) {
  const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

  const handleDelete = async () => {
    if (!item) return;
    const result = await deletePopularOrganizationAction(item.id);
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
