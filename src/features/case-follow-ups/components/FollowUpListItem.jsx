"use client";

import { Trash2, PhoneCall, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CASE_FOLLOW_UP_CONFIG } from "@/features/case-follow-ups/config/case-follow-up.constants";
import { formatDate } from "@/features/shared/lib/date-utils";

const { LABELS, DATETIME_FORMAT } = CASE_FOLLOW_UP_CONFIG.UI;

/**
 * Single follow-up row in the timeline.
 */
export function FollowUpListItem({ followUp, canDelete, isDeleting, onConfirmDelete }) {
  return (
    <div className="flex items-start justify-between p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <PhoneCall className="h-5 w-5 text-primary/70 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{followUp.userName || "—"}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {followUp.callStatusName || "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              {followUp.date ? formatDate(followUp.date, 'dd/MM/yyyy HH:mm') : "—"}
            </span>
          </div>
          {followUp.comment && (
            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{followUp.comment}</p>
          )}
          {followUp.currentDirectionName && (
            <p className="text-xs text-muted-foreground mt-1">{followUp.currentDirectionName}</p>
          )}
        </div>
      </div>

      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onConfirmDelete(followUp)}
          disabled={isDeleting}
          className="text-muted-foreground hover:text-destructive shrink-0 ml-2"
        >
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
}
