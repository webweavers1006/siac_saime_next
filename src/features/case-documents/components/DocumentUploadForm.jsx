"use client";

import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CASE_DOCUMENT_CONFIG } from "@/features/case-documents/config/case-document.constants";
import { FILE_ALLOWED_EXTENSIONS, FILE_MAX_SIZE, validateClientFile } from "@/features/shared/lib/file-validation";
import { toast } from "sonner";

const { LABELS } = CASE_DOCUMENT_CONFIG.UI;

/**
 * Upload form: file input + description + submit.
 * Does client-side pre-validation via shared lib.
 */
export function DocumentUploadForm({ caseId, onUploadStart, isUploading }) {
  const allowedAccept = FILE_ALLOWED_EXTENSIONS.map((e) => "." + e).join(",");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const result = validateClientFile(file);
    if (!result.valid) {
      const messages = LABELS.MESSAGES.ERROR;
      toast.error(messages[result.error] || "Archivo inválido.");
      e.target.value = "";
      return;
    }

    if (file.size > FILE_MAX_SIZE) {
      toast.error(LABELS.MESSAGES.ERROR.FILE_TOO_LARGE);
      e.target.value = "";
      return;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];
    const descriptionInput = form.querySelector("textarea");
    const description = descriptionInput?.value || "";

    if (!file) {
      toast.error(LABELS.MESSAGES.ERROR.NO_FILE);
      return;
    }

    onUploadStart({ file, description, form });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border bg-card p-4 space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Upload className="h-4 w-4" />
        Subir Documento
      </h3>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept={allowedAccept}
            className="cursor-pointer"
          />
        </div>

        <Textarea
          name="description"
          placeholder={LABELS.FORM.PLACEHOLDERS.DESCRIPTION}
          className="flex-1 h-10 resize-none"
          rows={1}
        />

        <Button type="submit" disabled={isUploading} size="sm">
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span className="ml-2 hidden sm:inline">Subir</span>
        </Button>
      </div>
    </form>
  );
}
