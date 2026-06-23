import { logger } from "@/features/shared";
import { Suspense } from "react";
import prisma from "@/features/shared/lib/prisma";
import { fetchAllCoordinatesForMap } from "@/features/case-coordinates/services/case-coordinate.read.service";
import { CaseCoordinateMap } from "@/features/case-coordinates/components/CaseCoordinateMapWrapper";
import { CaseCoordinateMapToolbar } from "@/features/case-coordinates/components/CaseCoordinateMapToolbar";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates/config/case-coordinate.constants";

const { UI, VIEW_MODES } = CASE_COORDINATE_CONFIG;
const { LABELS } = UI;
const VM = VIEW_MODES;

/**
 * Server component that fetches parish geo data with case counts and renders the map.
 * Filters come from searchParams and are passed to the toolbar and map.
 */
export async function CaseCoordinatePageContainer({ searchParams }) {
  const params = (await searchParams) || {};

  // Extract filters from URL
  const stateId = params.stateId || "";
  const municipalityId = params.municipalityId || "";
  const caseAreaId = params.caseAreaId || "";
  const caseStatusId = params.caseStatusId || "";
  const searchTerm = params.q || "";
  const viewMode = params.viewMode || VM.PARISH;

  let features;
  let debugCounts = { totalCases: 0, casesWithParish: 0, parishesWithCases: 0, parishesWithGeo: 0 };
  try {
    const filters = {
      stateId: stateId ? Number(stateId) : undefined,
      municipalityId: municipalityId ? Number(municipalityId) : undefined,
      caseAreaId: caseAreaId ? Number(caseAreaId) : undefined,
      caseStatusId: caseStatusId ? Number(caseStatusId) : undefined,
      searchTerm: searchTerm || undefined,
    };

    features = await fetchAllCoordinatesForMap(filters);

    // ── Debug: count cases and their parish links ─────────────────────
    const caseWhere = { deletedAt: null };
    if (filters.caseAreaId) caseWhere.caseAreaId = filters.caseAreaId;
    if (filters.caseStatusId) caseWhere.caseStatusId = filters.caseStatusId;

    const [totalCases, casesWithPerson] = await Promise.all([
      prisma.case.count({ where: caseWhere }),
      prisma.case.findMany({
        where: caseWhere,
        select: { person: { select: { parishId: true, id: true } } },
      }),
    ]);

    debugCounts.totalCases = totalCases;
    debugCounts.casesWithParish = casesWithPerson.filter((c) => c.person?.parishId != null).length;
    debugCounts.parishesWithCases = features.filter((f) => f.caseCount > 0).length;
    debugCounts.parishesWithGeo = features.length;
    debugCounts.casesWithoutPerson = casesWithPerson.filter((c) => !c.person?.id).length;
    debugCounts.casesWithoutParish = casesWithPerson.filter((c) => c.person?.id && c.person?.parishId == null).length;

    logger.info("Map debug counts", debugCounts);
  } catch (error) {
    logger.error("Error loading map data:", error);
    return (
      <ErrorAlert
        title="Error"
        message={LABELS.MESSAGES.ERROR.LOAD}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{CASE_COORDINATE_CONFIG.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.DESCRIPTION}
        </p>
      </div>

      <Suspense fallback={
        <div className="h-24 bg-muted/40 rounded-xl animate-pulse" />
      }>
        <CaseCoordinateMapToolbar
          initialFilters={{ stateId, municipalityId, caseAreaId, caseStatusId, searchTerm, viewMode }}
        />
      </Suspense>

      {/* Debug: case-to-parish chain counters */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3">
        <span>🔢 <strong>Total casos:</strong> {debugCounts.totalCases}</span>
        <span>👤 <strong>Casos sin persona:</strong> {debugCounts.casesWithoutPerson}</span>
        <span>📍 <strong>Casos con parroquia:</strong> {debugCounts.casesWithParish}</span>
        <span>🗺️ <strong>Casos sin parroquia (persona sin parishId):</strong> {debugCounts.casesWithoutParish}</span>
        <span>✅ <strong>Parroquias con casos:</strong> {debugCounts.parishesWithCases} / {debugCounts.parishesWithGeo}</span>
      </div>

      <CaseCoordinateMap
        features={features}
        viewMode={viewMode}
      />
    </div>
  );
}
