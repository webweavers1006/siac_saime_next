"use client";

import { Trash2, FileText, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_DOCUMENT_CONFIG } from "@/features/case-documents/config/case-document.constants";
import { formatFileSize } from "@/features/shared/lib/file-validation";
import { formatDate } from "@/features/shared/lib/date-utils";

const { LABELS, DATE_FORMAT } = CASE_DOCUMENT_CONFIG.UI;

/**
 * Builds the API URL to serve a document file.
 */
function buildDocumentUrl(caseId, documentId) {
  return CASE_DOCUMENT_CONFIG.API_DOWNLOAD_PATH
    .replace(":caseId", caseId)
    .replace(":documentId", documentId);
}

/**
 * Single document row: file icon, name (link), metadata, view + delete buttons.
 */
export function DocumentListItem({ doc, caseId, canDelete, isDeleting, onConfirmDelete }) {
  const apiUrl = buildDocumentUrl(caseId, doc.id);
  const displayName = doc.originalName || doc.filePath?.split("/").pop() || "Documento";

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <FileText className="h-5 w-5 text-primary/70 shrink-0" />
        <div className="min-w-0 flex-1">
          <a
            href={apiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium truncate hover:text-primary hover:underline block"
          >
            {displayName}
          </a>
          <div className="flex gap-3 text-xs text-muted-foreground">
            {doc.description && <span>{doc.description}</span>}
            <span>{formatFileSize(doc.fileSize)}</span>
            <span>{doc.extension?.toUpperCase()}</span>
            <span>{doc.createdAt ? formatDate(doc.createdAt, 'dd/MM/yyyy') : "—"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 ml-2">
        <Button variant="ghost" size="icon" asChild className="text-muted-foreground hover:text-foreground">
          <a href={apiUrl} target="_blank" rel="noopener noreferrer">
            <Eye className="h-4 w-4" />
          </a>
        </Button>

        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onConfirmDelete(doc)}
            disabled={isDeleting}
            className="text-muted-foreground hover:text-destructive"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}
