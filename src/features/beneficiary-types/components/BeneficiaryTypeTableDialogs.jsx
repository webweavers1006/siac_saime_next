"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BeneficiaryTypeForm } from "./BeneficiaryTypeForm";
import { BeneficiaryTypeDeleteDialog } from "./BeneficiaryTypeDeleteDialog";
import { BENEFICIARY_TYPE_CONFIG } from "../config/beneficiary-type.constants";

export function BeneficiaryTypeTableDialogs({
  open,
  onOpenChange,
  editingItem,
  deletingItem,
  setDeletingItem,
  onSuccess
}) {
  const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <BeneficiaryTypeForm
            defaultValues={editingItem}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      <BeneficiaryTypeDeleteDialog
        item={deletingItem}
        onOpenChange={(isOpen) => !isOpen && setDeletingItem(null)}
        onSuccess={onSuccess}
      />
    </>
  );
}
