/**
 * Centralized configuration for the Attention Channels module.
 */

export const ATTENTION_CHANNEL_CONFIG = {
  PATH: '/admin/canales-atencion',
  TITLE: 'Canales de atencion',

  PERMISSIONS: {
    VIEW: 'attention_channels:view',
    READ: 'attention_channels:read',
    WRITE: 'attention_channels:create',
    UPDATE: 'attention_channels:update',
    DELETE: 'attention_channels:delete',
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
          NAME: 'Nombre de la Red Social',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Instagram',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará la red social. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Red Social',
        UPDATE: 'Actualizar Red Social',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Red Social',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay redes sociales registradas.',
        EMPTY_SEARCH: 'No se encontraron redes sociales con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar redes sociales...',
        NEW_BUTTON: 'Nueva Red Social',
        SEARCH_LABEL: 'Búsqueda de Redes Sociales',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Redes Sociales',
      },
      DESCRIPTION: 'Administra las redes sociales del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Red social creada exitosamente.',
          UPDATE: 'Red social actualizada exitosamente.',
          DELETE: 'Red social eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las redes sociales.',
          CREATE: 'Error al crear la red social.',
          UPDATE: 'Error al actualizar la red social.',
          DELETE: 'Error al eliminar la red social.',
        }
      }
    }
  }
};
