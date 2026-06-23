/**
 * Centralized configuration for the Attention Type Details module.
 */

export const ATTENTION_TYPE_DETAIL_CONFIG = {
  PATH: '/admin/detalles-tipo-atencion',
  TITLE: 'Detalles de Tipo de Atención',

  PERMISSIONS: {
    VIEW: 'attention_type_details:view',
    READ: 'attention_type_details:read',
    WRITE: 'attention_type_details:create',
    UPDATE: 'attention_type_details:update',
    DELETE: 'attention_type_details:delete',
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
          ATTENTION_TYPE: 'Tipo de Atención',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Atención presencial',
          ATTENTION_TYPE: 'Seleccionar tipo de atención...',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el detalle de tipo de atención. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Detalle',
        UPDATE: 'Actualizar Detalle',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Detalle',
        ATTENTION_TYPE: 'Tipo de Atención',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay detalles de tipo de atención registrados.',
        EMPTY_SEARCH: 'No se encontraron detalles con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar detalles...',
        NEW_BUTTON: 'Nuevo Detalle',
        SEARCH_LABEL: 'Búsqueda de Detalles',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Detalles',
      },
      DESCRIPTION: 'Administra los detalles de tipos de atención del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Detalle de tipo de atención creado exitosamente.',
          UPDATE: 'Detalle de tipo de atención actualizado exitosamente.',
          DELETE: 'Detalle de tipo de atención eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los detalles de tipo de atención.',
          CREATE: 'Error al crear el detalle de tipo de atención.',
          UPDATE: 'Error al actualizar el detalle de tipo de atención.',
          DELETE: 'Error al eliminar el detalle de tipo de atención.',
        }
      }
    }
  }
};
