/**
 * Centralized configuration for the Popular Organizations module.
 */

export const POPULAR_ORGANIZATION_CONFIG = {
  PATH: '/admin/organizaciones-populares',
  TITLE: 'Organizaciones de Poder Popular',

  PERMISSIONS: {
    VIEW: 'popular_organizations:view',
    READ: 'popular_organizations:read',
    WRITE: 'popular_organizations:create',
    UPDATE: 'popular_organizations:update',
    DELETE: 'popular_organizations:delete',
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
          NAME: 'Nombre de la Organización',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Consejo Comunal Los Robles',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará la organización de poder popular. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Organización',
        UPDATE: 'Actualizar Organización',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Organización',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay organizaciones de poder popular registradas.',
        EMPTY_SEARCH: 'No se encontraron organizaciones con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar organizaciones...',
        NEW_BUTTON: 'Nueva Organización',
        SEARCH_LABEL: 'Búsqueda de Organizaciones',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Organizaciones',
      },
      DESCRIPTION: 'Administra las organizaciones de poder popular del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Organización de poder popular creada exitosamente.',
          UPDATE: 'Organización de poder popular actualizada exitosamente.',
          DELETE: 'Organización de poder popular eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las organizaciones de poder popular.',
          CREATE: 'Error al crear la organización de poder popular.',
          UPDATE: 'Error al actualizar la organización de poder popular.',
          DELETE: 'Error al eliminar la organización de poder popular.',
        }
      }
    }
  }
};
