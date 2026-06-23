"use client";

import { useState, useTransition, useCallback } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { uploadCaseDocumentAction, deleteCaseDocumentAction } from "@/features/case-documents/actions/case-document.write.action";
import { getCaseDocumentsByCaseIdAction } from "@/features/case-documents/actions/case-document.read.action";
import { CASE_DOCUMENT_CONFIG } from "@/features/case-documents/config/case-document.constants";
import { DocumentUploadForm } from "@/features/case-documents/components/DocumentUploadForm";
import { DocumentListItem } from "@/features/case-documents/components/DocumentListItem";

const { LABELS } = CASE_DOCUMENT_CONFIG.UI;

/**
 * Orchestrator: document list + upload for a case.
 * Delegates upload UI to DocumentUploadForm and list items to DocumentListItem.
 */
export function CaseDocumentsTab({ caseId, initialDocuments }) {
  const { can } = usePermission();
  const [documents, setDocuments] = useState(initialDocuments || []);
  const [isUploading, startUploading] = useTransition();
  const [deletingId, setDeletingId] = useState(null);

  const canUpload = can(CASE_DOCUMENT_CONFIG.PERMISSIONS.WRITE);
  const canDelete = can(CASE_DOCUMENT_CONFIG.PERMISSIONS.DELETE);

  const refreshDocuments = useCallback(() => {
    getCaseDocumentsByCaseIdAction(caseId).then((result) => {
      if (Array.isArray(result)) setDocuments(result);
    });
  }, [caseId]);

  const handleUpload = useCallback(
    ({ file, description, form }) => {
      startUploading(async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caseId", String(caseId));
        formData.append("description", description);

        const result = await uploadCaseDocumentAction(formData);
        if (result.success) {
          toast.success(result.message || LABELS.MESSAGES.SUCCESS.UPLOAD);
          form.reset();
          refreshDocuments();
        } else {
          toast.error(result.error || LABELS.MESSAGES.ERROR.UPLOAD);
        }
      });
    },
    [caseId, refreshDocuments]
  );

  const handleDelete = useCallback(
    (doc) => {
      if (!confirm(LABELS.FORM.DELETE_DIALOG.DESCRIPTION)) return;

      setDeletingId(doc.id);
      deleteCaseDocumentAction(doc.id).then((result) => {
        setDeletingId(null);
        if (result.success) {
          toast.success(result.message || LABELS.MESSAGES.SUCCESS.DELETE);
          setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        } else {
          toast.error(result.error || LABELS.MESSAGES.ERROR.DELETE);
        }
      });
    },
    []
  );

  return (
    <div className="space-y-6">
      {canUpload && (
        <DocumentUploadForm caseId={caseId} onUploadStart={handleUpload} isUploading={isUploading} />
      )}

      <div className="rounded-lg border">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay documentos registrados para este caso.</p>
          </div>
        ) : (
          <div className="divide-y">
            {documents.map((doc) => (
              <DocumentListItem
                key={doc.id}
                doc={doc}
                caseId={caseId}
                canDelete={canDelete}
                isDeleting={deletingId === doc.id}
                onConfirmDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
