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
import { getCaseFollowUpsByCaseIdAction } from "@/features/case-follow-ups/actions/case-follow-up.read.action";
import { deleteCaseFollowUpAction } from "@/features/case-follow-ups/actions/case-follow-up.write.action";
import { CASE_FOLLOW_UP_CONFIG } from "@/features/case-follow-ups/config/case-follow-up.constants";
import { FollowUpForm } from "./FollowUpForm";
import { FollowUpListItem } from "./FollowUpListItem";

const { LABELS } = CASE_FOLLOW_UP_CONFIG.UI;

export function CaseFollowUpDialog({ open, onOpenChange, caseData }) {
  const { can } = usePermission();
  const [followUps, setFollowUps] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const canDelete = can(CASE_FOLLOW_UP_CONFIG.PERMISSIONS.DELETE);

  const refresh = useCallback(() => {
    if (!caseData?.id) return;
    getCaseFollowUpsByCaseIdAction(caseData.id).then((r) => {
      if (Array.isArray(r)) setFollowUps(r);
    });
  }, [caseData]);

  useEffect(() => {
    if (open) refresh();
  }, [open, refresh]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    deleteCaseFollowUpAction(deleteTarget.id).then((r) => {
      setDeletingId(null);
      setDeleteTarget(null);
      if (r.success) {
        toast.success(r.message || LABELS.MESSAGES.SUCCESS.DELETE);
        setFollowUps((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      } else {
        toast.error(r.error || LABELS.MESSAGES.ERROR.DELETE);
      }
    });
  };

  const dialogTitle = `${caseData?.requestNumber || `Caso #${caseData?.id}`} — Seguimientos`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>


            <FollowUpForm caseId={caseData?.id} onSuccess={refresh} />

            {followUps.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                {LABELS.TABLE.EMPTY}
              </p>
            ) : (
              <div className="">
                {followUps.map((f) => (
                  <FollowUpListItem
                    key={f.id}
                    followUp={f}
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
