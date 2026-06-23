/**
 * Centralized configuration for Case Forwards (Remisiones) module.
 */

export const CASE_FORWARD_CONFIG = {
  PERMISSIONS: {
    READ: "case_forwards:read",
    READ_ALL: "case_forwards:read_all",
    WRITE: "case_forwards:create",
    UPDATE: "case_forwards:update",
    DELETE: "case_forwards:delete",
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  UI: {
    DATE_FORMAT: "dd/MM/yyyy",
    DATETIME_FORMAT: "dd/MM/yyyy HH:mm",
    LABELS: {
      FORM: {
        FIELDS: {
          ADMINISTRATIVE_DIRECTION: "Dirección Administrativa",
          DESCRIPTION: "Descripción",
          DATE: "Fecha",
        },
        PLACEHOLDERS: {
          ADMINISTRATIVE_DIRECTION: "Seleccionar dirección...",
          DESCRIPTION: "Ej: Remitido a Dirección de Investigaciones por competencia.",
        },
        DELETE_DIALOG: {
          TITLE: "¿Estás seguro?",
          DESCRIPTION: "Esta acción eliminará la remisión. No se puede deshacer.",
          CANCEL: "Cancelar",
          SUBMIT: "Eliminar",
        },
        SUBMIT: "Registrar Remisión",
        SAVING: "Guardando...",
      },
      TABLE: {
        DATE: "Fecha",
        DIRECTION: "Dirección Destino",
        USER: "Operador",
        STATUS: "Estado",
        EMPTY: "No hay remisiones registradas.",
        ACTIVE: "Vigente",
        INACTIVE: "Histórica",
      },
      MESSAGES: {
        SUCCESS: {
          CREATE: "Remisión registrada exitosamente.",
          DELETE: "Remisión eliminada exitosamente.",
        },
        ERROR: {
          CREATE: "Error al registrar la remisión.",
          DELETE: "Error al eliminar la remisión.",
          LOAD: "Error al cargar las remisiones.",
        },
      },
    },
  },
};
