"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { getCaseForwardsByCaseIdAction } from "@/features/case-forwards/actions/case-forward.read.action";
import { deleteCaseForwardAction } from "@/features/case-forwards/actions/case-forward.write.action";
import { CASE_FORWARD_CONFIG } from "@/features/case-forwards/config/case-forward.constants";
import { ForwardForm } from "./ForwardForm";
import { ForwardListItem } from "./ForwardListItem";

const { LABELS } = CASE_FORWARD_CONFIG.UI;

export function CaseForwardDialog({ open, onOpenChange, caseData }) {
  const { can } = usePermission();
  const [forwards, setForwards] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canDelete = can(CASE_FORWARD_CONFIG.PERMISSIONS.DELETE);

  const refresh = useCallback(() => {
    if (!caseData?.id) return;
    getCaseForwardsByCaseIdAction(caseData.id).then((r) => {
      if (Array.isArray(r)) setForwards(r);
    });
  }, [caseData]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    deleteCaseForwardAction(deleteTarget.id).then((r) => {
      setDeletingId(null);
      setDeleteTarget(null);
      if (r.success) {
        toast.success(r.message || LABELS.MESSAGES.SUCCESS.DELETE);
        setForwards((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      } else {
        toast.error(r.error || LABELS.MESSAGES.ERROR.DELETE);
      }
    });
  };

  const dialogTitle = `${caseData?.requestNumber || `Caso #${caseData?.id}`} — Remisiones`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>

          <ForwardForm caseId={caseData?.id} onSuccess={refresh} />

          {forwards.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {LABELS.TABLE.EMPTY}
            </p>
          ) : (
            <div className="">
              {forwards.map((f) => (
                <ForwardListItem
                  key={f.id}
                  forward={f}
                  canDelete={canDelete}
                  isDeleting={deletingId === f.id}
                  onConfirmDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={!!deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
        title={LABELS.FORM.DELETE_DIALOG.TITLE}
        description={LABELS.FORM.DELETE_DIALOG.DESCRIPTION}
      />
    </>
  );
}
