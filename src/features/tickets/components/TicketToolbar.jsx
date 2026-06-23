"use client";

import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { TICKET_CONFIG } from "../config/ticket.constants";
import { Toolbar } from "@/components/shared/Toolbar";

export function TicketToolbar({
  searchTerm,
  onSearchChange,
  onReset,
  onCreate,
}) {
  const { can } = usePermission();
  const { LABELS } = TICKET_CONFIG.UI;

  return (
    <Toolbar>
      <Toolbar.Footer>
        <Toolbar.Search
          label="Búsqueda de Turnos"
          placeholder={LABELS.TOOLBAR.SEARCH_PLACEHOLDER}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <Toolbar.Actions label="Gestión de Turnos">
          <Button variant="secondary" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            <span>{LABELS.CLEAN_BUTTON || "Limpiar"}</span>
          </Button>

          {can(TICKET_CONFIG.PERMISSIONS.CREATE) && (
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
