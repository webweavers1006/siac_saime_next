/**
 * Centralized configuration for Sent Emails module.
 *
 * This module handles:
 *  - SMTP transport (nodemailer)
 *  - Email template rendering
 *  - Audit log of sent emails (SentEmail table)
 *
 * Other features (cases, forwards, follow-ups) call sendEmail() from
 * the write service to trigger sends and audit records.
 */

export const SENT_EMAIL_CONFIG = {
  PATH: '/admin/correos-enviados',
  TITLE: 'Correos Enviados',

  PERMISSIONS: {
    VIEW: 'sent_emails:view',
    READ: 'sent_emails:read',
  },

  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },

  /** Enum of email trigger reasons. */
  REASONS: {
    CASE_CREATED: 'case_created',
    CASE_CLOSED: 'case_closed',
    CASE_FORWARDED: 'case_forwarded',
    CASE_UPDATED: 'case_updated',
  },

  /** Email send statuses */
  STATUS: {
    SENT: 'sent',
    FAILED: 'failed',
    BOUNCED: 'bounced',
  },

  /** SMTP configuration keys (read from process.env). */
  SMTP: {
    HOST: process.env.SMTP_HOST || '',
    PORT: Number(process.env.SMTP_PORT) || 587,
    SECURE: process.env.SMTP_SECURE === 'true',
    USER: process.env.SMTP_USER || '',
    PASS: process.env.SMTP_PASS || '',
    FROM_NAME: process.env.SMTP_FROM_NAME || 'SAIME — SIAC',
    FROM_ADDRESS: process.env.SMTP_FROM_ADDRESS || 'no-reply@saime.gob.ve',
  },

  UI: {
    LABELS: {
      DESCRIPTION: 'Registro de correos electrónicos enviados desde el sistema.',
      TABLE: {
        DESTINATION: 'Destinatario',
        SUBJECT: 'Asunto',
        REASON: 'Motivo',
        STATUS: 'Estado',
        DATE: 'Fecha de Envío',
        CASE: 'Caso',
        USER: 'Usuario',
        ERROR: 'Error',
        EMPTY: 'No hay correos enviados.',
        EMPTY_SEARCH: 'No se encontraron correos con los criterios de búsqueda.',
      },
      TOOLBAR: {
        SEARCH_PLACEHOLDER: 'Buscar por asunto o destinatario...',
        SEARCH_LABEL: 'Búsqueda de Correos',
        DIVIDER_SEARCH: 'Buscar por Texto',
        DIVIDER_ACTIONS: 'Filtros',
      },
      REASONS_MAP: {
        case_created: 'Caso Creado',
        case_closed: 'Caso Cerrado',
        case_forwarded: 'Caso Remitido',
        case_updated: 'Caso Actualizado',
      },
      STATUS_MAP: {
        sent: 'Enviado',
        failed: 'Fallido',
        bounced: 'Rebotado',
      },
      MESSAGES: {
        ERROR: {
          LOAD: 'No se pudieron cargar los correos enviados.',
        },
      },
    },
  },
};
