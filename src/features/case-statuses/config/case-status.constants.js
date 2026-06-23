/**
 * Centralized configuration for the Case Statuses module.
 */

export const CASE_STATUS_CONFIG = {
  PATH: '/admin/estatus-caso',
  TITLE: 'Estatus de Caso',

  PERMISSIONS: {
    VIEW: 'case_statuses:view',
    READ: 'case_statuses:read',
    WRITE: 'case_statuses:create',
    UPDATE: 'case_statuses:update',
    DELETE: 'case_statuses:delete',
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
          NAME: 'Ej: En Proceso',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el estatus de caso. No se puede deshacer.',
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
        EMPTY: 'No hay estatus de caso registrados.',
        EMPTY_SEARCH: 'No se encontraron estatus con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar estatus...',
        NEW_BUTTON: 'Nuevo Estatus',
        SEARCH_LABEL: 'Búsqueda de Estatus de Caso',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Estatus de Caso',
      },
      DESCRIPTION: 'Administra los estatus de caso del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Estatus de caso creado exitosamente.',
          UPDATE: 'Estatus de caso actualizado exitosamente.',
          DELETE: 'Estatus de caso eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los estatus de caso.',
          CREATE: 'Error al crear el estatus de caso.',
          UPDATE: 'Error al actualizar el estatus de caso.',
          DELETE: 'Error al eliminar el estatus de caso.',
        }
      }
    }
  }
};
