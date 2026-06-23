"use client";

import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { CASE_AREA_CONFIG } from "../config/case-area.constants";
import { Toolbar } from "@/components/shared/Toolbar";

export function CaseAreaToolbar({
  searchTerm,
  onSearchChange,
  onReset,
  onCreate,
}) {
  const { can } = usePermission();
  const { LABELS } = CASE_AREA_CONFIG.UI;

  return (
    <Toolbar>
      <Toolbar.Footer>
        <Toolbar.Search
          label={LABELS.TOOLBAR.SEARCH_LABEL}
          placeholder={LABELS.TOOLBAR.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Toolbar.Actions label={LABELS.TOOLBAR.DIVIDER_ACTIONS}>
          <Button variant="secondary" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            <span>{LABELS.CLEAN_BUTTON}</span>
          </Button>

          {can(CASE_AREA_CONFIG.PERMISSIONS.WRITE) && (
            <Button onClick={onCreate} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>{LABELS.TOOLBAR.NEW_BUTTON}</span>
            </Button>
          )}
        </Toolbar.Actions>
      </Toolbar.Footer>
    </Toolbar>
  );
}
