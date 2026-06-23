/**
 * Centralized configuration for the Offices module.
 */

export const OFFICE_CONFIG = {
  PATH: '/admin/oficinas',
  TITLE: 'Oficinas',

  PERMISSIONS: {
    VIEW: 'offices:view',
    READ: 'offices:read',
    WRITE: 'offices:create',
    UPDATE: 'offices:update',
    DELETE: 'offices:delete',
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
          NAME: 'Nombre de la Oficina',
          CODE: 'Código',
          ADDRESS: 'Dirección',
          STATE: 'Estado',
          CHIEF_NAME: 'Nombre del Jefe',
          CHIEF_ID_CARD: 'Cédula del Jefe',
          CHIEF_PHONE: 'Teléfono del Jefe',
          CHIEF_EMAIL: 'Email del Jefe',
          HAS_EMAIL_CHANGE: 'Cambio de Correo',
          HAS_FOREIGN_AFFAIRS: 'Extranjería',
          HAS_MIGRATION: 'Migración',
          ENABLE_QR_TICKET: 'QR Auto-Servicio',
          OBSERVATION: 'Observación',
          IS_ACTIVE: 'Activa',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Oficina Principal',
          CODE: 'Ej: OF025',
          ADDRESS: 'Ej: Avenida 5, entre Calles Argentina y Colombia...',
          CHIEF_NAME: 'Ej: Ana Pereira',
          CHIEF_ID_CARD: 'Ej: 26334158',
          CHIEF_PHONE: 'Ej: 0414-2608334',
          CHIEF_EMAIL: 'Ej: apereira@saime.gob.ve',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará la oficina. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Oficina',
        UPDATE: 'Actualizar Oficina',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Oficina',
        CODE: 'Código',
        STATE: 'Estado',
        CHIEF_NAME: 'Jefe',
        CHIEF_PHONE: 'Teléfono',
        HAS_EMAIL_CHANGE: 'C. Correo',
        HAS_FOREIGN_AFFAIRS: 'Extranjería',
        HAS_MIGRATION: 'Migración',
        ENABLE_QR_TICKET: 'QR',
        IS_ACTIVE: 'Activa',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay oficinas registradas.',
        EMPTY_SEARCH: 'No se encontraron oficinas con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar oficinas...',
        NEW_BUTTON: 'Nueva Oficina',
        SEARCH_LABEL: 'Búsqueda de Oficinas',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Oficinas',
      },
      DESCRIPTION: 'Administra las oficinas del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Oficina creada exitosamente.',
          UPDATE: 'Oficina actualizada exitosamente.',
          DELETE: 'Oficina eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las oficinas.',
          CREATE: 'Error al crear la oficina.',
          UPDATE: 'Error al actualizar la oficina.',
          DELETE: 'Error al eliminar la oficina.',
        }
      }
    }
  }
};
