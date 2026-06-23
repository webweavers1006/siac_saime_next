"use client";

/**
 * use-case-sheet-download.js
 * Client hook for generating and downloading a case planilla PDF.
 *
 * Responsibilities:
 * - Loading state management
 * - Fetch PDF from /api/case-sheets?caseId=X
 * - Trigger browser download via Blob + URL.createObjectURL
 * - Error handling with sonner toast
 * - Cleanup of object URLs
 */

import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";

/**
 * Hook for downloading a case planilla PDF.
 *
 * @param {object} options
 * @param {number} options.caseId - The case ID to generate a planilla for
 * @returns {{ download, isDownloading: boolean }}
 *   download — trigger function (call on button click)
 *   isDownloading — true while PDF is being fetched
 */
export function useCaseSheetDownload({ caseId } = {}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const objectUrlRef = useRef(null);

  const download = useCallback(async () => {
    if (!caseId || isDownloading) return;

    setIsDownloading(true);

    try {
      const url = `/api/case-sheets?caseId=${caseId}`;
      const response = await fetch(url);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || "Error al generar la planilla.");
      }

      const blob = await response.blob();

      // Build filename from Content-Disposition header or fallback
      const disposition = response.headers.get("Content-Disposition") || "";
      const filenameMatch = disposition.match(/filename="?(.+?)"?$/);
      const filename = filenameMatch?.[1] || `planilla_caso_${caseId}.pdf`;

      // Clean up previous object URL
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      // Create download link
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Planilla generada correctamente.");
    } catch (error) {
      toast.error(error.message || "No se pudo generar la planilla.");
    } finally {
      setIsDownloading(false);
    }
  }, [caseId, isDownloading]);

  return { download, isDownloading };
}
