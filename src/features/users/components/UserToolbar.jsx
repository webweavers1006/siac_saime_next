"use client";

import { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { usePermission } from "@/features/permissions/components/PermissionsProvider";
import { USER_CONFIG } from "../config/user.constants";
import { Toolbar } from "@/components/shared/Toolbar";

export function UserToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  onReset,
  onCreate,
}) {
  const { can } = usePermission();
  const { UI: { LABELS } } = USER_CONFIG;

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    if (localSearch === searchTerm) return;

    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, searchTerm]);

  const handleInputChange = (e) => setLocalSearch(e.target.value);

  const selectFilters = useMemo(() => [
    {
      key: "status",
      label: LABELS.TOOLBAR.STATUS_LABEL,
      value: statusFilter,
      onChange: onStatusChange,
      placeholder: LABELS.TOOLBAR.STATUS_LABEL,
      options: [
        { label: LABELS.TOOLBAR.STATUS_ALL, value: "all" },
        { label: LABELS.TOOLBAR.STATUS_ACTIVE, value: "active" },
        { label: LABELS.TOOLBAR.STATUS_INACTIVE, value: "inactive" },
      ],
      component: "select",
    }
  ], [statusFilter, onStatusChange, LABELS]);

  return (
    <Toolbar>
      <Toolbar.Main>
        <Toolbar.Filters>
          {selectFilters.map((f) => (
            <Toolbar.FilterItem key={f.key} label={f.label}>
              {f.component === "select" ? (
                <Select value={f.value} onValueChange={f.onChange}>
                  <SelectTrigger className="h-9 w-full bg-background/60 border-none focus-visible:ring-1 focus-visible:ring-ring">
                    <SelectValue placeholder={f.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </Toolbar.FilterItem>
          ))}
        </Toolbar.Filters>
      </Toolbar.Main>

      <Toolbar.Footer>
        <Toolbar.Search
          label={LABELS.TOOLBAR.SEARCH_LABEL}
          placeholder={LABELS.TOOLBAR.SEARCH_PLACEHOLDER}
          value={localSearch}
          onChange={handleInputChange}
        />

        <Toolbar.Actions label={LABELS.TOOLBAR.DIVIDER_ACTIONS}>
          <Button variant="secondary" onClick={onReset} className="gap-2">
            <X className="h-4 w-4" />
            <span>{LABELS.CLEAN_BUTTON}</span>
          </Button>

          {can(USER_CONFIG.PERMISSIONS.WRITE) && (
            <Button onClick={onCreate} className="gap-2">
              <UserPlus className="h-4 w-4" />
              <span>{LABELS.TOOLBAR.NEW_BUTTON}</span>
            </Button>
          )}
        </Toolbar.Actions>
      </Toolbar.Footer>
    </Toolbar>
  );
}
