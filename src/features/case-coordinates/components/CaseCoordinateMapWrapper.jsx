"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

/**
 * Client wrapper that loads the Leaflet map with ssr: false.
 * Leaflet CSS is imported here (not in the dynamic chunk) so Turbopack handles it correctly.
 */
const CaseCoordinateMap = dynamic(
  () =>
    import(
      "@/features/case-coordinates/components/CaseCoordinateMap"
    ).then((m) => m.CaseCoordinateMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-[70vh] bg-muted/20 rounded-lg">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span>Cargando mapa...</span>
        </div>
      </div>
    ),
  }
);

export { CaseCoordinateMap };
