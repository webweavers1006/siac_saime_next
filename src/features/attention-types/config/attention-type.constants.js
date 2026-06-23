/**
 * Centralized configuration for the Attention Types module.
 */

export const ATTENTION_TYPE_CONFIG = {
  PATH: '/admin/tipos-atencion',
  TITLE: 'Tipos de Atención',

  PERMISSIONS: {
    VIEW: 'attention_types:view',
    READ: 'attention_types:read',
    WRITE: 'attention_types:create',
    UPDATE: 'attention_types:update',
    DELETE: 'attention_types:delete',
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
          SHOW_CASE_AREA: 'Mostrar Área de Caso',
          SHOW_PARTICIPANTS: 'Mostrar Participantes',
          SEND_EMAIL: 'Enviar Correo',
          SHOW_POPULAR_ORG: 'Mostrar Org. Popular',
          SHOW_COORDINATES: 'Mostrar Coordenadas',
          SHOW_DOCUMENTS: 'Mostrar Documentos',
          SHOW_PUNTO_CUENTA: 'Mostrar Punto de Cuenta',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Presencial',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el tipo de atención. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Tipo de Atención',
        UPDATE: 'Actualizar Tipo de Atención',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Tipo de Atención',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay tipos de atención registrados.',
        EMPTY_SEARCH: 'No se encontraron tipos de atención con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar tipos de atención...',
        NEW_BUTTON: 'Nuevo Tipo de Atención',
        SEARCH_LABEL: 'Búsqueda de Tipos de Atención',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Tipos de Atención',
      },
      DESCRIPTION: 'Administra los tipos de atención del sistema y configura sus opciones de visualización.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Tipo de atención creado exitosamente.',
          UPDATE: 'Tipo de atención actualizado exitosamente.',
          DELETE: 'Tipo de atención eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los tipos de atención.',
          CREATE: 'Error al crear el tipo de atención.',
          UPDATE: 'Error al actualizar el tipo de atención.',
          DELETE: 'Error al eliminar el tipo de atención.',
        }
      }
    }
  }
};
