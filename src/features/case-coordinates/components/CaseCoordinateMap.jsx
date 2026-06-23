"use client";

import { useMemo, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates/config/case-coordinate.constants";

const { MAP, VIEW_MODES, COLOR_SCALE, UI } = CASE_COORDINATE_CONFIG;
const { LABELS } = UI;

/**
 * Returns the choropleth color for a given case count.
 */
function getChoroplethColor(caseCount) {
  if (caseCount === 0) return COLOR_SCALE.ZERO;
  if (caseCount <= 2) return COLOR_SCALE.LOW;
  if (caseCount <= 5) return COLOR_SCALE.MEDIUM;
  return COLOR_SCALE.HIGH;
}

/**
 * Generates a deterministic color from a string (for municipality/state grouping).
 */
function hashColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 45%, 65%)`;
}

/**
 * Fits the map to show all GeoJSON features.
 */
function MapBoundsUpdater({ features }) {
  const map = useMap();
  useEffect(() => {
    if (features && features.length > 0) {
      const geoLayer = L.geoJSON(features);
      const bounds = geoLayer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [features, map]);
  return null;
}

/**
 * Choropleth legend — only shown in "parish" view mode.
 */
function MapLegend() {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white/90 rounded-lg p-3 shadow text-xs space-y-1">
      <span className="font-semibold text-sm">{LABELS.MAP.LEGEND_TITLE}</span>
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded" style={{ background: COLOR_SCALE.ZERO }} />
        <span>0</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded" style={{ background: COLOR_SCALE.LOW }} />
        <span>1–2</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded" style={{ background: COLOR_SCALE.MEDIUM }} />
        <span>3–5</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="inline-block w-4 h-4 rounded" style={{ background: COLOR_SCALE.HIGH }} />
        <span>6+</span>
      </div>
    </div>
  );
}

/**
 * Renders a Leaflet choropleth map of Venezuelan parishes colored by case density.
 *
 * @param {object} props
 * @param {Array}  props.features  — Parish domain objects with geoData, caseCount, municipalityName, stateName
 * @param {string} props.viewMode — 'parish' | 'municipality' | 'state'
 */
export function CaseCoordinateMap({ features: initialFeatures, viewMode }) {
  const features = initialFeatures || [];

  // Build a valid GeoJSON FeatureCollection from parish domain data
  const geoJsonData = useMemo(() => {
    if (!features || features.length === 0) return null;

    const geoFeatures = features
      .filter((f) => f.geoData)
      .map((f) => {
        // Determine color based on view mode
        let fillColor;
        if (viewMode === VIEW_MODES.STATE) {
          fillColor = hashColor(f.stateName || String(f.stateId));
        } else if (viewMode === VIEW_MODES.MUNICIPALITY) {
          fillColor = hashColor(f.municipalityName || String(f.municipalityId));
        } else {
          fillColor = getChoroplethColor(f.caseCount);
        }

        return {
          type: "Feature",
          properties: {
            id: f.id,
            parishName: f.name,
            municipalityName: f.municipalityName,
            stateName: f.stateName,
            caseCount: f.caseCount,
            fillColor,
          },
          geometry: f.geoData,
        };
      });

    return { type: "FeatureCollection", features: geoFeatures };
  }, [features, viewMode]);

  // Style function for GeoJSON layer
  const geoStyle = useCallback((feature) => {
    return {
      fillColor: feature?.properties?.fillColor || COLOR_SCALE.ZERO,
      weight: 0.8,
      opacity: 0.6,
      color: "#555",
      fillOpacity: 0.7,
    };
  }, []);

  // Popup on click
  const onEachFeature = useCallback((feature, layer) => {
    const p = feature.properties;
    if (!p) return;
    const html = [
      `<div style="font-size:13px;min-width:160px;">`,
      `<strong style="font-size:14px;">${p.parishName || ""}</strong>`,
      `<p style="margin:2px 0;color:#666;">${LABELS.MAP.POPUP.MUNICIPALITY}: ${p.municipalityName || "—"}</p>`,
      `<p style="margin:2px 0;color:#666;">${LABELS.MAP.POPUP.STATE}: ${p.stateName || "—"}</p>`,
      `<p style="margin:4px 0 0;font-weight:600;">${LABELS.MAP.POPUP.CASES}: ${p.caseCount ?? 0}</p>`,
      `</div>`,
    ].join("");
    layer.bindPopup(html);
  }, []);

  // Empty state
  if (!geoJsonData || geoJsonData.features.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] bg-muted/20 rounded-lg text-muted-foreground gap-3">
        <span className="text-lg">🗺️</span>
        <p>{LABELS.MAP.NO_DATA}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden border" style={{ height: "70vh", position: "relative" }}>
      <MapContainer
        center={MAP.DEFAULT_CENTER}
        zoom={MAP.DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer attribution={MAP.ATTRIBUTION} url={MAP.TILE_LAYER} />
        <GeoJSON
          key={`${viewMode}-${features.length}`}
          data={geoJsonData}
          style={geoStyle}
          onEachFeature={onEachFeature}
        />
        <MapBoundsUpdater features={geoJsonData.features} />
      </MapContainer>
      {viewMode === VIEW_MODES.PARISH && <MapLegend />}
    </div>
  );
}
