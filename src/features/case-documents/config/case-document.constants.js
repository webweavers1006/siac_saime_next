/**
 * Centralized configuration for the Case Documents module.
 * Labels and UI config only. File validation lives in shared/lib/file-validation.js
 */

export const CASE_DOCUMENT_CONFIG = {
  PERMISSIONS: {
    READ: "case_documents:read",
    WRITE: "case_documents:create",
    DELETE: "case_documents:delete",
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  /** API route to serve a document file. Use: `/api/cases/<caseId>/documents/<documentId>` */
  API_DOWNLOAD_PATH: "/api/cases/:caseId/documents/:documentId",

  UI: {
    DATE_FORMAT: "dd/MM/yyyy HH:mm",
    LABELS: {
      FORM: {
        FIELDS: {
          FILE: "Archivo",
          DESCRIPTION: "Descripción",
        },
        PLACEHOLDERS: {
          DESCRIPTION: "Ej: Formulario de solicitud firmado",
        },
        DELETE_DIALOG: {
          TITLE: "¿Estás seguro?",
          DESCRIPTION:
            "Esta acción eliminará el documento y el archivo asociado. No se puede deshacer.",
          CANCEL: "Cancelar",
          SUBMIT: "Eliminar",
        },
      },
      MESSAGES: {
        SUCCESS: {
          UPLOAD: "Documento subido exitosamente.",
          DELETE: "Documento eliminado exitosamente.",
        },
        ERROR: {
          UPLOAD: "Error al subir el documento.",
          DELETE: "Error al eliminar el documento.",
          LOAD: "Error al cargar los documentos.",
          NO_FILE: "No se seleccionó ningún archivo.",
          FILE_TOO_LARGE: "El archivo excede el tamaño máximo permitido (10 MB).",
          INVALID_EXTENSION: "Extensión de archivo no permitida.",
          INVALID_NAME: "El nombre del archivo contiene caracteres no permitidos.",
          STORAGE: "Error al guardar el archivo en el servidor.",
        },
      },
    },
  },
};
