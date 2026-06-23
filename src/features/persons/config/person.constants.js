/**
 * Centralized configuration for the Persons module.
 */

export const PERSON_CONFIG = {
  PATH: '/admin/personas',
  TITLE: 'Personas',

  PERMISSIONS: {
    VIEW: 'persons:view',
    READ: 'persons:read',
    WRITE: 'persons:create',
    UPDATE: 'persons:update',
    DELETE: 'persons:delete',
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
        SECTIONS: {
          PERSONAL_DATA: 'Datos Personales',
          DEMOGRAPHICS: 'Demográficos',
          CLASSIFICATION: 'Clasificación',
          LOCATION: 'Ubicación',
        },
        FIELDS: {
          FIRST_NAME: 'Nombre',
          LAST_NAME: 'Apellido',
          ID_CARD: 'Cédula',
          PHONE: 'Teléfono',
          EMAIL: 'Correo',
          ADDRESS: 'Dirección',
          NATIONALITY: 'Nacionalidad',
          SEX: 'Sexo',
          AGE: 'Edad',
          BIRTH_DATE: 'Fecha Nacimiento',
          PROFESSION: 'Profesión',
          PERSON_TYPE: 'Tipo',
          LEGAL_INFO: 'Info Legal',
          COUNTRY: 'País',
          STATE: 'Estado',
          MUNICIPALITY: 'Municipio',
          PARISH: 'Parroquia',
          BENEFICIARY_TYPE: 'Tipo Beneficiario',
        },
        PLACEHOLDERS: {
          FIRST_NAME: 'Ej: Juan',
          LAST_NAME: 'Ej: Pérez',
          ID_CARD: 'Ej: V12345678',
          PHONE: 'Ej: 04141234567',
          EMAIL: 'Ej: correo@ejemplo.com',
          ADDRESS: 'Dirección completa...',
          AGE: 'Ej: 30',
          BIRTH_DATE: 'Seleccionar fecha',
          PROFESSION: 'Ej: Abogado',
          LEGAL_INFO: 'Información legal relevante...',
          COUNTRY: 'Seleccionar país...',
          STATE: 'Seleccionar estado...',
          MUNICIPALITY: 'Seleccionar municipio...',
          PARISH: 'Seleccionar parroquia...',
          BENEFICIARY_TYPE: 'Seleccionar tipo...',
        },
        NATIONALITY_OPTIONS: [
          { label: 'Venezolano', value: 'V' },
          { label: 'Extranjero', value: 'E' },
          { label: 'Jurídico', value: 'J' },
        ],
        SEX_OPTIONS: [
          { label: 'Masculino', value: 'M' },
          { label: 'Femenino', value: 'F' },
        ],
        PERSON_TYPE_OPTIONS: [
          { label: 'Participante', value: 'PARTICIPANT' },
          { label: 'Tercero', value: 'THIRD_PARTY' },
          { label: 'Persona de Caso', value: 'CASE_PERSON' },
        ],
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará la persona. No se puede deshacer.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        SUBMIT: 'Crear Persona',
        UPDATE: 'Actualizar Persona',
        SAVING: 'Guardando...',
      },
      TABLE: {
        FIRST_NAME: 'Nombre',
        LAST_NAME: 'Apellido',
        ID_CARD: 'Cédula',
        COUNTRY: 'País',
        STATE: 'Estado',
        PERSON_TYPE: 'Tipo',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay personas registradas.',
        EMPTY_SEARCH: 'No se encontraron personas con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar personas...',
        NEW_BUTTON: 'Nueva Persona',
        SEARCH_LABEL: 'Búsqueda de Personas',
        DIVIDER_SEARCH: 'Buscar por Nombre, Apellido o Cédula',
        DIVIDER_ACTIONS: 'Gestión de Personas',
      },
      DESCRIPTION: 'Administra las personas registradas en el sistema.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Persona creada exitosamente.',
          UPDATE: 'Persona actualizada exitosamente.',
          DELETE: 'Persona eliminada exitosamente.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener las personas.',
          CREATE: 'Error al crear la persona.',
          UPDATE: 'Error al actualizar la persona.',
          DELETE: 'Error al eliminar la persona.',
        }
      }
    }
  }
};
