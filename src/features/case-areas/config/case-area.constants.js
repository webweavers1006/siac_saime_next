/**
 * Centralized configuration for the Case Areas module.
 */

export const CASE_AREA_CONFIG = {
  PATH: '/admin/areas-caso',
  TITLE: 'Áreas de Caso',

  PERMISSIONS: {
    VIEW: 'case_areas:view',
    READ: 'case_areas:read',
    WRITE: 'case_areas:create',
    UPDATE: 'case_areas:update',
    DELETE: 'case_areas:delete',
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
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Identificación',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el área de caso. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Área de Caso',
        UPDATE: 'Actualizar Área de Caso',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Área de Caso',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay áreas de caso registradas.',
        EMPTY_SEARCH: 'No se encontraron áreas de caso con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar áreas de caso...',
        NEW_BUTTON: 'Nueva Área de Caso',
        SEARCH_LABEL: 'Búsqueda de Áreas de Caso',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Áreas de Caso',
      },
      DESCRIPTION: 'Administra las áreas de caso del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Área de caso creada exitosamente.',
          UPDATE: 'Área de caso actualizada exitosamente.',
          DELETE: 'Área de caso eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las áreas de caso.',
          CREATE: 'Error al crear el área de caso.',
          UPDATE: 'Error al actualizar el área de caso.',
          DELETE: 'Error al eliminar el área de caso.',
        }
      }
    }
  }
};
