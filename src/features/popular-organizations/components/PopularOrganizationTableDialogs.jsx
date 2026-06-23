"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PopularOrganizationForm } from "./PopularOrganizationForm";
import { PopularOrganizationDeleteDialog } from "./PopularOrganizationDeleteDialog";
import { POPULAR_ORGANIZATION_CONFIG } from "../config/popular-organization.constants";

export function PopularOrganizationTableDialogs({
  open,
  onOpenChange,
  editingItem,
  deletingItem,
  setDeletingItem,
  onSuccess
}) {
  const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <PopularOrganizationForm
            defaultValues={editingItem}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <PopularOrganizationDeleteDialog
        item={deletingItem}
        onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
