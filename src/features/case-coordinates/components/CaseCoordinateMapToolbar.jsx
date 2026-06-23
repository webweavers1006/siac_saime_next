"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Toolbar } from "@/components/shared/Toolbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates/config/case-coordinate.constants";
import { getStatesForSelectAction } from "@/features/states/actions/state.select.action";
import { getMunicipalitiesForSelectAction } from "@/features/municipalities/actions/municipality.select.action";
import { getCaseAreasForSelectAction } from "@/features/case-areas/actions/case-area.select.action";
import { getCaseStatusesForSelectAction } from "@/features/case-statuses/actions/case-status.select.action";

const { VIEW_MODES, UI } = CASE_COORDINATE_CONFIG;
const { LABELS } = UI;

/**
 * Standardized toolbar for the Case Map.
 *
 * Filters update URL searchParams, triggering server-side re-fetch.
 *
 * Filters: Estado → Municipio (cascading) | Área | Estatus | Parish search | View mode
 *
 * @param {object} props
 * @param {object} props.initialFilters — { stateId, municipalityId, caseAreaId, caseStatusId, searchTerm, viewMode }
 */
export function CaseCoordinateMapToolbar({ initialFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local state synced from URL
  const stateId = searchParams.get("stateId") || initialFilters?.stateId || "";
  const municipalityId = searchParams.get("municipalityId") || initialFilters?.municipalityId || "";
  const caseAreaId = searchParams.get("caseAreaId") || initialFilters?.caseAreaId || "";
  const caseStatusId = searchParams.get("caseStatusId") || initialFilters?.caseStatusId || "";
  const searchTerm = searchParams.get("q") || initialFilters?.searchTerm || "";
  const viewMode = searchParams.get("viewMode") || initialFilters?.viewMode || VIEW_MODES.PARISH;

  // Dropdown data
  const [states, setStates] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [statuses, setStatuses] = useState([]);

  // Load static dropdowns on mount
  useEffect(() => {
    async function load() {
      try {
        const [s, a, st] = await Promise.all([
          getStatesForSelectAction({}),
          getCaseAreasForSelectAction({}),
          getCaseStatusesForSelectAction({}),
        ]);
        setStates(s);
        setAreas(a);
        setStatuses(st);
      } catch { /* non-blocking */ }
    }
    load();
  }, []);

  // Load municipalities when state changes
  useEffect(() => {
    if (!stateId) { setMunicipalities([]); return; }
    async function load() {
      try {
        const m = await getMunicipalitiesForSelectAction({ stateId: Number(stateId) });
        setMunicipalities(m);
      } catch { /* non-blocking */ }
    }
    load();
  }, [stateId]);

  // Update URL with new params
  const updateParams = useCallback((updates) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (value === "" || value == null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }

      // Reset municipality when state changes
      if ("stateId" in updates && updates.stateId !== stateId) {
        params.delete("municipalityId");
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    });
  }, [router, searchParams, stateId]);

  // Clear all filters
  const handleClear = useCallback(() => {
    startTransition(() => {
      router.replace("", { scroll: false });
    });
  }, [router]);

  return (
    <Toolbar>
      <Toolbar.Main>
        <Toolbar.Filters>
          <Toolbar.Divider label={LABELS.TOOLBAR.DIVIDER_FILTERS} />

          {/* Estado */}
          <Toolbar.FilterItem label={LABELS.FILTERS.STATE} width="180px">
            <Select value={stateId} onValueChange={(v) => updateParams({ stateId: v })}>
              <SelectTrigger className="h-10 bg-background/60 border-none">
                <SelectValue placeholder={LABELS.FILTERS.STATE_PLACEHOLDER} />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.value} value={String(s.value)}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar.FilterItem>

          {/* Municipio (cascades from state) */}
          <Toolbar.FilterItem label={LABELS.FILTERS.MUNICIPALITY} width="190px">
            <Select
              value={municipalityId}
              onValueChange={(v) => updateParams({ municipalityId: v })}
              disabled={!stateId}
            >
              <SelectTrigger className="h-10 bg-background/60 border-none">
                <SelectValue placeholder={
                  stateId ? LABELS.FILTERS.MUNICIPALITY_PLACEHOLDER : "Seleccione un estado primero"
                } />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar.FilterItem>

          {/* Área de Caso */}
          <Toolbar.FilterItem label={LABELS.FILTERS.AREA} width="180px">
            <Select value={caseAreaId} onValueChange={(v) => updateParams({ caseAreaId: v })}>
              <SelectTrigger className="h-10 bg-background/60 border-none">
                <SelectValue placeholder={LABELS.FILTERS.AREA_PLACEHOLDER} />
              </SelectTrigger>
              <SelectContent>
                {areas.map((a) => (
                  <SelectItem key={a.value} value={String(a.value)}>{a.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar.FilterItem>

          {/* Estatus de Caso */}
          <Toolbar.FilterItem label={LABELS.FILTERS.STATUS} width="190px">
            <Select value={caseStatusId} onValueChange={(v) => updateParams({ caseStatusId: v })}>
              <SelectTrigger className="h-10 bg-background/60 border-none">
                <SelectValue placeholder={LABELS.FILTERS.STATUS_PLACEHOLDER} />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.value} value={String(s.value)}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Toolbar.FilterItem>
        </Toolbar.Filters>

        <Toolbar.Footer>
          {/* Parish search */}
          <Toolbar.Search
            label={LABELS.TOOLBAR.SEARCH_LABEL}
            placeholder={LABELS.TOOLBAR.SEARCH_PLACEHOLDER}
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce search — update on blur or after short delay
              updateParams({ q: value || null });
            }}
          />

          <Toolbar.Actions label={LABELS.TOOLBAR.DIVIDER_VIEW}>
            {/* View mode selector */}
            <Select value={viewMode} onValueChange={(v) => updateParams({ viewMode: v })}>
              <SelectTrigger className="h-10 w-[160px] bg-background/60 border-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={VIEW_MODES.PARISH}>{LABELS.VIEW_MODES.PARISH}</SelectItem>
                <SelectItem value={VIEW_MODES.MUNICIPALITY}>{LABELS.VIEW_MODES.MUNICIPALITY}</SelectItem>
                <SelectItem value={VIEW_MODES.STATE}>{LABELS.VIEW_MODES.STATE}</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear button */}
            <Button variant="secondary" onClick={handleClear} className="gap-2" disabled={isPending}>
              <X className="h-4 w-4" />
              <span>{LABELS.CLEAN_BUTTON}</span>
            </Button>
          </Toolbar.Actions>
        </Toolbar.Footer>
      </Toolbar.Main>
    </Toolbar>
  );
}
