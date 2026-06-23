/**
 * Centralized configuration for the Call Statuses module.
 */

export const CALL_STATUS_CONFIG = {
  PATH: '/admin/estatus-llamada',
  TITLE: 'Estatus de Llamada',

  PERMISSIONS: {
    VIEW: 'call_statuses:view',
    READ: 'call_statuses:read',
    WRITE: 'call_statuses:create',
    UPDATE: 'call_statuses:update',
    DELETE: 'call_statuses:delete',
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
          NAME: 'Nombre del Estatus',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Atendida',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el estatus de llamada. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Estatus',
        UPDATE: 'Actualizar Estatus',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Estatus',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay estatus de llamada registrados.',
        EMPTY_SEARCH: 'No se encontraron estatus con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar estatus...',
        NEW_BUTTON: 'Nuevo Estatus',
        SEARCH_LABEL: 'Búsqueda de Estatus de Llamada',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Estatus de Llamada',
      },
      DESCRIPTION: 'Administra los estatus de llamada del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Estatus de llamada creado exitosamente.',
          UPDATE: 'Estatus de llamada actualizado exitosamente.',
          DELETE: 'Estatus de llamada eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los estatus de llamada.',
          CREATE: 'Error al crear el estatus de llamada.',
          UPDATE: 'Error al actualizar el estatus de llamada.',
          DELETE: 'Error al eliminar el estatus de llamada.',
        }
      }
    }
  }
};
