/**
 * Centralized configuration for the Reasons module.
 */

export const REASON_CONFIG = {
  PATH: '/admin/motivos',
  TITLE: 'Motivos',

  PERMISSIONS: {
    VIEW: 'reasons:view',
    READ: 'reasons:read',
    WRITE: 'reasons:create',
    UPDATE: 'reasons:update',
    DELETE: 'reasons:delete',
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    SEARCH_TAKE: 10,
  },

  UI: {
    ITEMS_PER_PAGE: 10,
    LABELS: {
      CLEAN_BUTTON: 'Limpiar',
      FORM: {
        FIELDS: {
          NAME: 'Nombre',
          CASE_AREA: 'Área de Caso',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Solicitud de pasaporte',
          CASE_AREA: 'Seleccionar área de caso...',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el motivo. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Motivo',
        UPDATE: 'Actualizar Motivo',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Motivo',
        CASE_AREA: 'Área de Caso',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay motivos registrados.',
        EMPTY_SEARCH: 'No se encontraron motivos con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar motivos...',
        NEW_BUTTON: 'Nuevo Motivo',
        SEARCH_LABEL: 'Búsqueda de Motivos',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Motivos',
      },
      DESCRIPTION: 'Administra los motivos del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Motivo creado exitosamente.',
          UPDATE: 'Motivo actualizado exitosamente.',
          DELETE: 'Motivo eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los motivos.',
          CREATE: 'Error al crear el motivo.',
          UPDATE: 'Error al actualizar el motivo.',
          DELETE: 'Error al eliminar el motivo.',
        }
      }
    }
  }
};
