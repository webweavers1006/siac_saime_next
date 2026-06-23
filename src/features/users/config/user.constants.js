/**
 * Configuración centralizada para el módulo de Usuarios.
 */

export const USER_CONFIG = {
  // Rutas del módulo
  PATH: '/admin/users',
  TITLE: 'Usuarios',

  // Permisos requeridos
  PERMISSIONS: {
    VIEW: 'users:view',
    READ: 'users:read',
    READ_ALL: 'users:read_all',
    WRITE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },

  // Estados de usuario
  STATUS: {
    ALL: 'all',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
  },

  // Configuración de Paginación
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    SEARCH_TAKE: 10,
  },

  // Configuración de visualización (Frontend)
  UI: {
    BADGE_VARIANTS: {
      ACTIVE: 'default',
      INACTIVE: 'secondary',
    },
    LABELS: {
      ACTIVE: 'Activo',
      INACTIVE: 'Inactivo',
      NO_ROLE: 'Sin Rol',
      CLEAN_BUTTON: 'Limpiar',
      FORM: {
        FIELDS: {
          NAME: 'Nombre',
          LASTNAME: 'Apellido',
          CEDULA: 'Cédula',
          EMAIL: 'Email',
          PASSWORD: 'Contraseña',
          ROLE: 'Rol',
          DIRECTION: 'Dirección',
          ATTENTION_CHANNEL: 'Canal de Atención',
          OFFICE: 'Oficina',
          STATUS: 'Estado del Usuario',
        },
        PLACEHOLDERS: {
          NAME: 'Ej: Juan',
          LASTNAME: 'Ej: Pérez',
          CEDULA: 'Ej: 123456789',
          EMAIL: 'juan@empresa.com',
          PASSWORD: 'Mínimo 6 caracteres',
          PASSWORD_EDIT: 'Dejar en blanco para mantener',
          SELECT_ROLE: 'Seleccionar Rol',
          SELECT_DIRECTION: 'Seleccionar dirección...',
          SELECT_ATTENTION_CHANNEL: 'Seleccionar canal...',
        },
        DESCRIPTIONS: {
          ACTIVE: 'Usuario activo en el sistema',
          INACTIVE: 'Usuario inactivo',
        },
        DELETE_DIALOG: {
          TITLE: '¿Estás seguro?',
          DESCRIPTION: 'Esta acción eliminará al usuario. No se puede deshacer. Si tiene historial, considera inactivarlo en su lugar.',
          CANCEL: 'Cancelar',
          SUBMIT: 'Eliminar',
        },
        DIALOG: {
          TITLE_CREATE: 'Nuevo Usuario',
          TITLE_EDIT: 'Editar Usuario',
          DESCRIPTION_CREATE: 'Completa el formulario para registrar un nuevo usuario en el sistema.',
          DESCRIPTION_EDIT: 'Modifica la información del usuario existente.',
        },
        SUBMIT: 'Crear Usuario',
        UPDATE: 'Actualizar Usuario',
        SAVING: 'Guardando...',
      },
      TABLE: {
        NAME: 'Nombre Completo',
        CEDULA: 'Cédula',
        EMAIL: 'Email',
        ROLE: 'Rol',
        STATUS: 'Estado',
        ACTIONS: 'Acciones',
        EMPTY_SEARCH: 'No se encontraron usuarios.',
        EMPTY_DATA: 'No hay usuarios registrados.',
        ENTITY_NAME: 'usuarios',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar por nombre o cédula...',
        STATUS_LABEL: 'Estado',
        STATUS_ALL: 'Todos los Estados',
        STATUS_ACTIVE: 'Activos',
        STATUS_INACTIVE: 'Inactivos',
        NEW_BUTTON: 'Nuevo Usuario',
        SEARCH_LABEL: 'Búsqueda de Personal',
        DIVIDER_FILTERS: 'Filtros de Búsqueda',
        DIVIDER_SEARCH: 'Búsqueda Rápida',
        DIVIDER_ACTIONS: 'Acciones Disponibles',
      },
      DESCRIPTION: 'Administra los usuarios del sistema y sus roles asignados.',
      MESSAGES: {
        ERROR: {
          LOAD: 'No se pudieron cargar los datos de usuarios. Verifique la conexión a la base de datos.',
        },
        SUCCESS: {
          SAVE: 'Usuario guardado exitosamente.',
          DELETE: 'Usuario eliminado exitosamente.',
        }
      }
    }
  }
};
