/**
 * Centralized configuration for the Administrative Directions module.
 */

export const ADMINISTRATIVE_DIRECTION_CONFIG = {
  PATH: '/admin/direcciones-administrativas',
  TITLE: 'Direcciones Administrativas',

  PERMISSIONS: {
    VIEW: 'administrative_directions:view',
    READ: 'administrative_directions:read',
    WRITE: 'administrative_directions:create',
    UPDATE: 'administrative_directions:update',
    DELETE: 'administrative_directions:delete',
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
          EMAIL: 'Correo Electrónico',
          IS_AUDIT: '¿Es de Auditoría?',
          DEFAULT_AREA: 'Área por Defecto',
          ALLOWED_AREAS: 'Áreas Permitidas',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Dirección General',
          EMAIL: 'Ej: contacto@entidad.gob.ve',
          SELECT_AREA: 'Seleccionar área por defecto...',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará la dirección administrativa. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Dirección Administrativa',
        UPDATE: 'Actualizar Dirección Administrativa',
        SAVING: 'Guardando...',
      },
      AREAS_DIALOG: {
        TITLE_PREFIX: 'Áreas de',
        NO_AREAS: 'No hay áreas disponibles.',
        CANCEL: 'Cancelar',
        SUBMIT: 'Guardar Áreas',
        SAVING: 'Guardando...',
        SUCCESS: 'Áreas actualizadas exitosamente.',
        ERROR: 'Error al guardar las áreas.',
        UNEXPECTED_ERROR: 'Error inesperado al guardar las áreas.',
      },
      TABLE: {
        NAME: 'Dirección',
        EMAIL: 'Correo',
        IS_AUDIT: 'Auditoría',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay direcciones administrativas registradas.',
        EMPTY_SEARCH: 'No se encontraron direcciones administrativas con los criterios de búsqueda.',
        YES: 'Sí',
        NO: 'No',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar direcciones administrativas...',
        NEW_BUTTON: 'Nueva Dirección Administrativa',
        SEARCH_LABEL: 'Búsqueda de Direcciones Administrativas',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Direcciones',
      },
      DESCRIPTION: 'Administra las direcciones administrativas del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Dirección administrativa creada exitosamente.',
          UPDATE: 'Dirección administrativa actualizada exitosamente.',
          DELETE: 'Dirección administrativa eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las direcciones administrativas.',
          CREATE: 'Error al crear la dirección administrativa.',
          UPDATE: 'Error al actualizar la dirección administrativa.',
          DELETE: 'Error al eliminar la dirección administrativa.',
        }
      }
    }
  }
};
