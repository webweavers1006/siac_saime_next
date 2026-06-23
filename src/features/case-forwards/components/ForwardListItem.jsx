"use client";

import { Trash2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_FORWARD_CONFIG } from "@/features/case-forwards/config/case-forward.constants";
import { formatDate } from "@/features/shared/lib/date-utils";

const { LABELS, DATETIME_FORMAT } = CASE_FORWARD_CONFIG.UI;

/**
 * Single forward row in the timeline.
 */
export function ForwardListItem({ forward, canDelete, isDeleting, onConfirmDelete }) {
  return (
    <div className="flex items-start justify-between p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <Send className="h-5 w-5 text-primary/70 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{forward.userName || "—"}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {forward.administrativeDirectionName || "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {forward.date ? formatDate(forward.date, 'dd/MM/yyyy HH:mm') : "—"}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              forward.isActive
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}>
              {forward.isActive ? LABELS.TABLE.ACTIVE : LABELS.TABLE.INACTIVE}
            </span>
          </div>
          {forward.description && (
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{forward.description}</p>
          )}
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConfirmDelete(forward)}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
