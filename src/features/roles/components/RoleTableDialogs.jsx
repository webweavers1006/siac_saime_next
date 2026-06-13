"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoleForm } from "./RoleForm";
import { RoleDeleteDialog } from "./RoleDeleteDialog";
import { ROLE_CONFIG } from "../config/role.constants";

export function RoleTableDialogs({
  open,
  onOpenChange,
  editingRole,
  deletingRole,
  setDeletingRole,
  onSuccess
}) {
  const { LABELS } = ROLE_CONFIG.UI;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
            </DialogTitle>
          </DialogHeader>
          <RoleForm
            role={editingRole}
            onSuccess={() => {
              onOpenChange(false);
              onSuccess?.();
            }}
          />
        </DialogContent>
      </Dialog>

      {deletingRole && (
        <RoleDeleteDialog
          role={deletingRole}
          open={!!deletingRole}
          onOpenChange={(open) => !open && setDeletingRole(null)}
          onSuccess={onSuccess}
        />
      )}
    </>
  );
}
