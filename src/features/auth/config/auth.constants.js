/**
 * Configuración centralizada para el módulo de Autenticación.
 */

export const AUTH_CONFIG = {
  // Rutas del módulo
  PATH: {
    LOGIN: '/login',
    DASHBOARD: '/',
  },

  // Roles por defecto
  ROLES: {
    ADMIN: 'ADMIN',
    USER: 'USER',
  },

  // Cookies y Sesión
  SESSION: {
    COOKIE_NAME: 'session',
    EXPIRES_IN_MS: 8 * 60 * 60 * 1000, // 8 horas en milisegundos
    EXPIRES_IN_STR: '8h', // Expiración en cadena para jose signJWT
  },

  // Rate Limiting
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,                      // máximo de intentos por ventana
    WINDOW_MS: 15 * 60 * 1000,            // 15 minutos en milisegundos
    HEADERS: {
      CLIENT_IP: 'x-forwarded-for',       // header para IP de cliente (proxy/CDN)
      REAL_IP: 'x-real-ip',               // header alternativo de IP real
    },
  },

  // Mensajes de error
  ERRORS: {
    INVALID_CREDENTIALS: 'Credenciales incorrectas',
    SERVER_ERROR: 'Error del servidor al autenticar',
    UNAUTHORIZED: 'Usuario no autenticado',
    FORBIDDEN: 'No tienes permiso para realizar esta acción',
    RATE_LIMITED: 'Demasiados intentos. Intenta de nuevo en unos minutos.',
  },
  UI: {
    LABELS: {
      HEADER: {
        TITLE: 'SAIME - Sistema de Atención al Ciudadano',
      },
      CARD: {
        TITLE: 'Bienvenido',
        DESCRIPTION: 'Ingresa tus credenciales para acceder al panel',
      },
      SEPARATOR: 'Accede con tu cuenta',
      FORM: {
        EMAIL: 'Correo Electrónico',
        EMAIL_PLACEHOLDER: 'admin@admin.starter',
        PASSWORD: 'Contraseña',
        PASSWORD_PLACEHOLDER: '••••••',
        SUBMIT: 'Iniciar Sesión',
      },
      FOOTER: {
        TERMS_TEXT: 'Al iniciar sesión, aceptas los',
        TERMS_LINK: 'Términos de Servicio',
        PRIVACY_LINK: 'Política de Privacidad',
      }
    }
  }
};
