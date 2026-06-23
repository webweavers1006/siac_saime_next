/**
 * Centralized configuration for Case Follow-ups module.
 */

export const CASE_FOLLOW_UP_CONFIG = {
  PERMISSIONS: {
    READ: "case_follow_ups:read",
    WRITE: "case_follow_ups:create",
    UPDATE: "case_follow_ups:update",
    DELETE: "case_follow_ups:delete",
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
          CALL_STATUS: "Estatus de Llamada",
          COMMENT: "Comentario",
          DATE: "Fecha",
          TIME: "Hora",
        },
        PLACEHOLDERS: {
          CALL_STATUS: "Seleccionar estatus...",
          COMMENT: "Ej: Llamada realizada. Ciudadano atendido satisfactoriamente.",
          TIME: "HH:mm",
        },
        DELETE_DIALOG: {
          TITLE: "¿Estás seguro?",
          DESCRIPTION: "Esta acción eliminará el seguimiento. No se puede deshacer.",
          CANCEL: "Cancelar",
          SUBMIT: "Eliminar",
        },
        SUBMIT: "Registrar Seguimiento",
        SAVING: "Guardando...",
      },
      TABLE: {
        DATE: "Fecha",
        CALL_STATUS: "Estatus",
        COMMENT: "Comentario",
        USER: "Operador",
        DIRECTION: "Dirección",
        EMPTY: "No hay seguimientos registrados.",
      },
      MESSAGES: {
        SUCCESS: {
          CREATE: "Seguimiento registrado exitosamente.",
          DELETE: "Seguimiento eliminado exitosamente.",
        },
        ERROR: {
          CREATE: "Error al registrar el seguimiento.",
          DELETE: "Error al eliminar el seguimiento.",
          LOAD: "Error al cargar los seguimientos.",
        },
      },
    },
  },
};
