"use client";

/**
 * GenerateSheetButton.jsx
 * Reusable button for generating a case planilla PDF.
 *
 * Used by:
 * - CaseDetailView (toolbar button with text)
 * - CaseTable actions column (icon-only via extraActions)
 *
 * Props:
 * - caseId: number
 * - variant: 'button' (default, full label + icon) | 'icon' (icon-only for table actions)
 * - className: optional additional classes
 */

import { Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCaseSheetDownload } from "../hooks/use-case-sheet-download";
import { CASE_SHEET_CONFIG } from "../config/case-sheet.constants";

export function GenerateSheetButton({ caseId, variant = "button", className = "" }) {
  const { download, isDownloading } = useCaseSheetDownload({ caseId });

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={download}
        disabled={isDownloading}
        className={`inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50 ${className}`}
        title={CASE_SHEET_CONFIG.UI.LABELS.GENERATE_SHEET_TOOLTIP}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Printer className="h-4 w-4" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={download}
      disabled={isDownloading}
      className={`gap-2 ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {CASE_SHEET_CONFIG.UI.LABELS.DOWNLOADING}
        </>
      ) : (
        <>
          <Printer className="h-4 w-4" />
          {CASE_SHEET_CONFIG.UI.LABELS.GENERATE_SHEET}
        </>
      )}
    </Button>
  );
}
