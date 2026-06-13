/**
 * Configuración centralizada para el módulo de Permisos.
 * Enforces Config-Driven UI — no hardcoded strings in permission components.
 */

export const PERMISSION_CONFIG = {
  // Permisos requeridos para este módulo
  PERMISSIONS: {
    READ: 'permissions:read',
  },

  UI: {
    LABELS: {
      SELECTOR: {
        TITLE: "Permisos del Sistema",
        SEARCH_PLACEHOLDER: "Buscar permisos...",
        EMPTY_TITLE: "No se encontraron permisos",
        EMPTY_SUBTITLE: "Intenta con otros términos de búsqueda",
      },
      HEADER: {
        SELECTED_COUNT: (selected, total) => `${selected} de ${total} seleccionados`,
        SELECT_ALL: "Seleccionar todo",
        DESELECT_ALL: "Deseleccionar todo",
      },
    },
  },
};
