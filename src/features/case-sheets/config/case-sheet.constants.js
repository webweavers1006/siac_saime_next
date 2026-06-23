/**
 * case-sheet.constants.js
 * Configuration for case planilla PDF generation.
 * All UI labels in Spanish per project conventions.
 */

import { FileText } from "lucide-react";

export const CASE_SHEET_CONFIG = {
  PATH: null, // No dedicated page — accessed from case detail & cases table
  TITLE: 'Planillas',

  PERMISSIONS: {
    GENERATE: 'case_sheets:generate',
  },

  // Paper & layout config (matches legacy FPDF: letter, portrait, 10mm margins)
  PAGE: {
    FORMAT: 'letter',
    ORIENTATION: 'portrait',
    UNIT: 'mm',
    MARGINS: { top: 10, right: 10, bottom: 10, left: 10 },
    AUTO_BREAK: 15, // bottom margin before page break
  },

  // SAIME institutional color palette (matches legacy FPDF)
  COLORS: {
    SAIME_BLUE: [25, 55, 90],
    DARK_TEXT: [40, 40, 40],
    LIGHT_GRAY: [100, 100, 100],
    BORDER_GRAY: [230, 230, 230],
    DIVIDER_GRAY: [200, 200, 200],
    WHITE: [255, 255, 255],
    BLACK: [0, 0, 0],
  },

  // Cintillo image configuration
  CINTILLO: {
    PATH: 'public/img/cintillo.jpg',
    X: 10,
    Y: 10,
    WIDTH: 190,
    HEIGHT: 25,
    FORMAT: 'JPEG',
  },

  // Maps attentionTypeId → template name
  TEMPLATE_MAP: {
    5: 'denuncia',
    // 1 (Asesoría), 2 (Sugerencia), 3 (Queja), 4 (Reclamo), 6 (Petición) → generic
    DEFAULT: 'generic',
  },

  // Checkbox labels for generic planilla (matches legacy FPDF Header_Planilla)
  ATTENTION_TYPE_CHECKBOXES: {
    1: 'ASESORÍA',
    2: 'SUGERENCIA',
    3: 'QUEJA',
    4: 'RECLAMO',
    6: 'PETICIÓN',
  },

  // Complaint checkboxes (matches legacy Content_Denuncia)
  COMPLAINT_AFFECTS: [
    { key: 'affectsPerson', label: 'a) Personal' },
    { key: 'affectsCommunity', label: 'b) Comunidad' },
    { key: 'affectsThirdParties', label: 'c) Terceros' },
  ],

  // Batch generation
  BATCH: {
    MAX_CASES: 50,
    MODE: 'zip', // 'zip' (individual PDFs in ZIP) or 'combined' (single multi-page PDF)
    FILENAME_PREFIX: 'planilla',
  },

  UI: {
    ICON: FileText,
    LABELS: {
      // Buttons
      GENERATE_SHEET: 'Planilla',
      GENERATE_SHEET_TOOLTIP: 'Generar planilla PDF',
      GENERATE_BATCH: 'Generar Planillas',
      GENERATE_BATCH_TOOLTIP: 'Generar planillas para los casos seleccionados',
      DOWNLOADING: 'Generando planilla...',

      // Planilla titles (per format)
      TITLES: {
        GENERIC: 'PLANILLA DE ATENCIÓN AL CIUDADANO',
        ASESORIA: 'PLANILLA DE ASESORÍA',
        DENUNCIA: 'RECEPCIÓN DE LA DENUNCIA',
        SUBTITLE: 'DIRECCIÓN DE ATENCIÓN AL CIUDADANO',
      },

      // Section headers
      SECTIONS: {
        APPLICANT_DATA: 'DATOS DEL SOLICITANTE',
        DESCRIPTION: 'DESCRIPCIÓN DE LA SOLICITUD',
        DENUNCIATION_DESC: 'BREVE DESCRIPCIÓN DE LA DENUNCIA',
        AFFECTS: '1- ¿A QUIÉN AFECTA EL HECHO?',
        INVOLVED: '2- PERSONAS, ORGANISMOS O INSTITUCIONES INVOLUCRADAS:',
        INCIDENT_DATE: '3- FECHA DE LOS HECHOS:',
        POPULAR_POWER: 'DATOS DEL PODER POPULAR',
      },

      // Field labels
      FIELDS: {
        CASE_NUMBER: 'Nº:',
        DATE: 'FECHA:',
        TIME: 'HORA:',
        NAMES: 'NOMBRES:',
        ID_CARD: 'CÉDULA:',
        MUNICIPALITY: 'MUNICIPIO:',
        PARISH: 'PARROQUIA:',
        PHONE: 'TELÉFONO:',
        EMAIL: 'CORREO:',
        SIGNATURE: 'FIRMA:',
        ATTACHED_ENTITY: 'ENTE ADSCRITO:',
        RECEPTOR: 'RECEPTOR:',
        POSITION: 'CARGO:',
        DATE_LINE: 'FECHA: __________________________',
        SIGNATURE_LINE: 'FIRMA Y SELLO: __________________________',
        SIGNATURE_APPLICANT: 'FIRMA DEL SOLICITANTE: __________________________',
        INSTANCE: 'Instancia:',
        RIF: 'RIF:',
        FINANCING_ENTITY: 'Ente:',
        APPROVED_AMOUNT: 'Monto:',
      },

      // Footer
      FOOTER: {
        LINE1: 'Servicio Administrativo de Identificación, Migración y Extranjería',
        LINE2: 'Avenida Baralt, frente a la Plaza Miranda, Saime Sede Central, Planta Baja. Caracas, Venezuela',
        LINE3: 'Teléfonos (0800)-SAIME-00 (0800-7246300) | Código Postal 1010',
        WEB: 'www.saime.gob.ve',
      },
    },
  },
};
