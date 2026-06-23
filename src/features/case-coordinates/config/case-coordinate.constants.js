/**
 * Centralized configuration for the Case Map module.
 *
 * Renders a choropleth map of Venezuelan parishes colored by case density.
 * Data source: Parish.geoData (GeoJSON polygons) + case counts via Person → Parish.
 */

export const CASE_COORDINATE_CONFIG = {
  PATH: '/admin/mapa',
  TITLE: 'Mapa de Casos',

  PERMISSIONS: {
    VIEW: 'case_coordinates:view',
    READ: 'case_coordinates:read',
    WRITE: 'case_coordinates:create',
    UPDATE: 'case_coordinates:update',
    DELETE: 'case_coordinates:delete',
  },

  MAP: {
    DEFAULT_CENTER: [7.1193, -66.1818], // Venezuela centroid
    DEFAULT_ZOOM: 6,
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; OpenStreetMap contributors',
  },

  /** View modes — determines how parishes are colored */
  VIEW_MODES: {
    PARISH: 'parish',
    MUNICIPALITY: 'municipality',
    STATE: 'state',
  },

  /** Choropleth color scale — green palette (light → dark) */
  COLOR_SCALE: {
    ZERO: '#e8f5e9',    // 0 cases
    LOW: '#a5d6a7',     // 1-2 cases
    MEDIUM: '#66bb6a',  // 3-5 cases
    HIGH: '#2e7d32',    // 6+ cases
  },

  UI: {
    LABELS: {
      CLEAN_BUTTON: 'Limpiar filtros',

      TOOLBAR: {
        DIVIDER_FILTERS: 'Filtros del Mapa',
        DIVIDER_VIEW: 'Modo de Vista',
        SEARCH_LABEL: 'Buscar Parroquia',
        SEARCH_PLACEHOLDER: 'Buscar por nombre de parroquia...',
      },

      FILTERS: {
        STATE: 'Estado',
        STATE_PLACEHOLDER: 'Todos los estados',
        MUNICIPALITY: 'Municipio',
        MUNICIPALITY_PLACEHOLDER: 'Todos los municipios',
        AREA: 'Área de Caso',
        AREA_PLACEHOLDER: 'Todas las áreas',
        STATUS: 'Estatus de Caso',
        STATUS_PLACEHOLDER: 'Todos los estatus',
        VIEW_MODE: 'Colorear por',
      },

      VIEW_MODES: {
        PARISH: 'Parroquia',
        MUNICIPALITY: 'Municipio',
        STATE: 'Estado',
      },

      MAP: {
        LEGEND_TITLE: 'Casos',
        NO_DATA: 'No hay parroquias con datos geográficos para mostrar.',
        LOADING: 'Cargando mapa...',
        POPUP: {
          PARISH: 'Parroquia',
          MUNICIPALITY: 'Municipio',
          STATE: 'Estado',
          CASES: 'Casos',
        },
      },

      DESCRIPTION: 'Visualiza la distribución geográfica de casos por parroquia, municipio y estado.',

      MESSAGES: {
        ERROR: {
          LOAD: 'No se pudieron cargar los datos del mapa.',
        },
      },
    },
  },
};
