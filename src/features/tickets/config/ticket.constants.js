/**
 * Centralized configuration for the Tickets module.
 */

export const TICKET_CONFIG = {
  PATH: '/admin/turnos',
  TITLE: 'Turnos',

  PERMISSIONS: {
    VIEW: 'tickets:view',
    READ: 'tickets:read',
    CREATE: 'tickets:create',
    UPDATE: 'tickets:update',
    DELETE: 'tickets:delete',
    CALL: 'tickets:call',
  },

  DISPLAY_PATH: '/turnos',

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },

  // ── Status Machine ──────────────────────────────────────────────────

  STATUS: {
    CREATED: 'CREATED',
    WAITING: 'WAITING',
    CALLED: 'CALLED',
    IN_ATTENTION: 'IN_ATTENTION',
    FINISHED: 'FINISHED',
    DERIVED: 'DERIVED',
    CANCELLED: 'CANCELLED',
  },

  /**
   * Allowed transitions from each status.
   * Key = current status, Value = array of valid next statuses.
   */
  TRANSITIONS: {
    CREATED: ['WAITING', 'CANCELLED'],
    WAITING: ['CALLED', 'CANCELLED'],
    CALLED: ['IN_ATTENTION', 'CANCELLED'],
    IN_ATTENTION: ['FINISHED', 'DERIVED'],
    DERIVED: ['FINISHED'],
    FINISHED: [],
    CANCELLED: [],
  },

  /**
   * Human-readable labels for each status.
   */
  STATUS_LABELS: {
    CREATED: 'Creado',
    WAITING: 'En Espera',
    CALLED: 'Llamado',
    IN_ATTENTION: 'En Atención',
    FINISHED: 'Finalizado',
    DERIVED: 'Derivado a Caso',
    CANCELLED: 'Cancelado',
  },

  // ── Ticket Numbering ────────────────────────────────────────────────

  /**
   * Prefix mapping by attention type.
   * Falls back to 'G' (General) if no match.
   */
  PREFIX_MAP: {
    1: 'A',  // Asesoría
    2: 'S',  // Sugerencia
    3: 'Q',  // Queja
    4: 'R',  // Reclamo
    5: 'D',  // Denuncia
    6: 'P',  // Petición
  },
  DEFAULT_PREFIX: 'G',

  // ── Service Types (for public form — maps office capabilities) ──────

  SERVICE_TYPES: {
    FOREIGN_AFFAIRS: 'FOREIGN_AFFAIRS',
    MIGRATION: 'MIGRATION',
    EMAIL_CHANGE: 'EMAIL_CHANGE',
    GENERAL: 'GENERAL',
  },

  SERVICE_LABELS: {
    FOREIGN_AFFAIRS: 'Extranjería',
    MIGRATION: 'Migración',
    EMAIL_CHANGE: 'Cambio de Correo',
    GENERAL: 'Atención General',
  },

  // ── Timeouts ────────────────────────────────────────────────────────

  /** Seconds before an unanswered CALLED ticket auto-cancels. */
  CALL_TIMEOUT_SECONDS: 60,

  // ── SSE ─────────────────────────────────────────────────────────────

  SSE: {
    /** Polling interval in ms for the internal SSE loop. */
    POLL_INTERVAL_MS: 3000,
    EVENTS: {
      CONNECTED: 'connected',
      QUEUE_UPDATE: 'queue:update',
      TICKET_CALLED: 'ticket:called',
      TICKET_IN_ATTENTION: 'ticket:in_attention',
      TICKET_FINISHED: 'ticket:finished',
      TICKET_DERIVED: 'ticket:derived',
      TICKET_CANCELLED: 'ticket:cancelled',
    },
  },

  // ── Rate Limiting ───────────────────────────────────────────────────

  RATE_LIMIT: {
    PUBLIC_TICKET: {
      MAX_ATTEMPTS: 10,
      WINDOW_MS: 15 * 60 * 1000,
    },
  },

  // ── UI Labels ───────────────────────────────────────────────────────

  UI: {
    ITEMS_PER_PAGE: 10,
    LABELS: {
      CLEAN_BUTTON: 'Limpiar',
      FORM: {
        FIELDS: {
          ATTENTION_TYPE: 'Tipo de Atención',
          OFFICE: 'Oficina',
          PERSON_ID_CARD: 'Cédula',
          PERSON_FIRST_NAME: 'Nombre',
          PERSON_LAST_NAME: 'Apellido',
          PERSON_PHONE: 'Teléfono',
          NOTES: 'Notas',
          DESK_NUMBER: 'Taquilla',
        },
        PLACEHOLDERS: {
          ATTENTION_TYPE: 'Seleccionar tipo de atención...',
          OFFICE: 'Seleccionar oficina...',
          PERSON_ID_CARD: 'Ej: 12345678',
          PERSON_FIRST_NAME: 'Nombre del ciudadano',
          PERSON_LAST_NAME: 'Apellido del ciudadano',
          PERSON_PHONE: 'Ej: 0412-1234567',
          NOTES: 'Notas adicionales...',
          DESK_NUMBER: 'Ej: 3',
        },
        SUBMIT: 'Generar Turno',
        SAVING: 'Generando...',
      },
      ADVISOR: {
        CALL_NEXT: 'Llamar Siguiente',
        START_ATTENTION: 'Iniciar Atención',
        FINISH: 'Finalizar',
        DERIVE_TO_CASE: 'Derivar a Caso',
        NO_SHOW: 'No Respondió',
        MY_QUEUE: 'Mi Cola',
        CURRENT_TICKET: 'Turno Actual',
        WAITING_COUNT: 'En espera',
        NO_TICKETS: 'No hay turnos en espera.',
      },
      DISPLAY: {
        TITLE: 'SAIME — Atención al Ciudadano',
        NOW_SERVING: 'Ahora Atendiendo',
        WAITING: 'En Espera',
        ATTENDED_TODAY: 'Atendidos Hoy',
        AVG_WAIT_TIME: 'Tiempo promedio',
        EMPTY: 'No hay turnos activos.',
      },
      TABLE: {
        TICKET_NUMBER: 'Turno',
        STATUS: 'Estatus',
        OFFICE: 'Oficina',
        ATTENTION_TYPE: 'Tipo',
        PERSON: 'Ciudadano',
        ADVISOR: 'Asesor',
        DESK: 'Taquilla',
        SERVICE: 'Servicio',
        CREATED_AT: 'Creado',
        CALLED_AT: 'Llamado',
        ACTIONS: 'Acciones',
        EMPTY: 'No hay turnos registrados.',
        EMPTY_SEARCH: 'No se encontraron turnos con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar turnos...',
        NEW_BUTTON: 'Nuevo Turno',
      },
      DESCRIPTION: 'Gestiona los turnos de atención al ciudadano.',
      MESSAGES: {
        SUCCESS: {
          CREATE: 'Turno generado exitosamente.',
          CALL: 'Turno llamado exitosamente.',
          START: 'Atención iniciada.',
          FINISH: 'Atención finalizada.',
          DERIVE: 'Turno derivado a caso.',
          CANCEL: 'Turno cancelado.',
        },
        ERROR: {
          LOAD: 'No se pudieron obtener los turnos.',
          CREATE: 'Error al generar el turno.',
          CALL: 'Error al llamar el turno.',
          UPDATE: 'Error al actualizar el turno.',
          NO_WAITING: 'No hay turnos en espera.',
        },
      },
    },
  },
};
