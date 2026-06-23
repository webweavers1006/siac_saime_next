/**
 * Centralized configuration for the Beneficiary Types module.
 */

export const BENEFICIARY_TYPE_CONFIG = {
  PATH: '/admin/tipos-beneficiario',
  TITLE: 'Tipos de Beneficiario',

  PERMISSIONS: {
    VIEW: 'beneficiary_types:view',
    READ: 'beneficiary_types:read',
    WRITE: 'beneficiary_types:create',
    UPDATE: 'beneficiary_types:update',
    DELETE: 'beneficiary_types:delete',
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
          REQUIRES_ID_CARD: 'Requiere Cédula',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Venezolano',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará el tipo de beneficiario. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Tipo de Beneficiario',
        UPDATE: 'Actualizar Tipo de Beneficiario',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Tipo de Beneficiario',
        REQUIRES_ID_CARD: 'Requiere Cédula',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay tipos de beneficiario registrados.',
        EMPTY_SEARCH: 'No se encontraron tipos de beneficiario con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar tipos de beneficiario...',
        NEW_BUTTON: 'Nuevo Tipo de Beneficiario',
        SEARCH_LABEL: 'Búsqueda de Tipos de Beneficiario',
        DIVIDER_SEARCH: 'Buscar por Nombre',
        DIVIDER_ACTIONS: 'Gestión de Tipos de Beneficiario',
      },
      DESCRIPTION: 'Administra los tipos de beneficiario del sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Tipo de beneficiario creado exitosamente.',
          UPDATE: 'Tipo de beneficiario actualizado exitosamente.',
          DELETE: 'Tipo de beneficiario eliminado exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los tipos de beneficiario.',
          CREATE: 'Error al crear el tipo de beneficiario.',
          UPDATE: 'Error al actualizar el tipo de beneficiario.',
          DELETE: 'Error al eliminar el tipo de beneficiario.',
        }
      }
    }
  }
};
