"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { saveDirectionAreasAction } from "../actions/direction-areas.action";
import { ADMINISTRATIVE_DIRECTION_CONFIG } from "../config/administrative-direction.constants";

export function DirectionAreasDialog({ direction, allAreas, open, onOpenChange, onSuccess }) {
  const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;
  const { AREAS_DIALOG: D } = LABELS;

  const [selectedIds, setSelectedIds] = useState([]);
  const [isPending, startTransition] = useTransition();

  // Sync selectedIds when direction changes or dialog opens
  useEffect(() => {
    if (direction && open) {
      setSelectedIds(direction?.allowedAreas?.map(a => a.areaId) || []);
    }
  }, [direction, open]);

  const handleToggle = (areaId, checked) => {
    setSelectedIds(prev =>
      checked ? [...prev, areaId] : prev.filter(id => id !== areaId)
    );
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        const result = await saveDirectionAreasAction(direction.id, selectedIds);
        if (result.success) {
          toast.success(result.message || D.SUCCESS);
          onOpenChange(false);
          onSuccess?.();
        } else {
          toast.error(result.error || D.ERROR);
        }
      } catch {
        toast.error(D.UNEXPECTED_ERROR);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {D.TITLE_PREFIX} {direction?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-4">
          {allAreas.map((area) => {
            const isChecked = selectedIds.includes(area.id);
            return (
              <label
                key={area.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded px-2 py-1.5"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => handleToggle(area.id, checked)}
                />
                <span className="text-sm">{area.name}</span>
              </label>
            );
          })}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {D.CANCEL}
          </Button>
          <Button type="button" onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? D.SAVING : D.SUBMIT}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
