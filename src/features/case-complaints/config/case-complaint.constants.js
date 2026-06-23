/**
 * Centralized configuration for Case Complaints module.
 * Permissions are inherited from cases — no separate permission checks needed.
 */

export const CASE_COMPLAINT_CONFIG = {
  UI: {
    LABELS: {
      FORM: {
        FIELDS: {
          AFFECTS_PERSON: "¿Afecta a persona?",
          AFFECTS_COMMUNITY: "¿Afecta a la comunidad?",
          AFFECTS_THIRD_PARTIES: "¿Afecta a terceros?",
          INVOLVED_PARTIES: "Involucrados",
          INCIDENT_DATE: "Fecha de los hechos",
          POPULAR_INSTANCE: "Instancia del poder popular",
          INSTANCE_RIF: "RIF de la instancia",
          FINANCING_ENTITY: "Ente financiador",
          PROJECT_NAME: "Nombre del proyecto",
          APPROVED_AMOUNT: "Monto aprobado",
        },
      },
      MESSAGES: {
        SUCCESS: {
          UPSERT: "Denuncia guardada exitosamente.",
        },
        ERROR: {
          UPSERT: "Error al guardar la denuncia.",
          LOAD: "Error al cargar la denuncia.",
        },
      },
    },
  },
};
