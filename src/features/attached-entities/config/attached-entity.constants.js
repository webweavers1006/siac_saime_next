/**
 * Centralized configuration for the Attached Entities module.
 */

export const ATTACHED_ENTITY_CONFIG = {
  PATH: '/admin/entes-adscritos',
  TITLE: 'Entes Adscritos',

  PERMISSIONS: {
    VIEW: 'attached_entities:view',
    READ: 'attached_entities:read',
    WRITE: 'attached_entities:create',
    UPDATE: 'attached_entities:update',
    DELETE: 'attached_entities:delete',
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
          NAME: 'Nombre del Ente Adscrito',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Ministerio de Educación',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el ente adscrito. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Ente Adscrito',
        UPDATE: 'Actualizar Ente Adscrito',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Ente Adscrito',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay entes adscritos registrados.',
        EMPTY_SEARCH: 'No se encontraron entes adscritos con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar entes adscritos...',
        NEW_BUTTON: 'Nuevo Ente Adscrito',
        SEARCH_LABEL: 'Búsqueda de Entes Adscritos',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Entes Adscritos',
      },
      DESCRIPTION: 'Administra los entes adscritos del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Ente adscrito creado exitosamente.',
          UPDATE: 'Ente adscrito actualizado exitosamente.',
          DELETE: 'Ente adscrito eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los entes adscritos.',
          CREATE: 'Error al crear el ente adscrito.',
          UPDATE: 'Error al actualizar el ente adscrito.',
          DELETE: 'Error al eliminar el ente adscrito.',
        }
      }
    }
  }
};
