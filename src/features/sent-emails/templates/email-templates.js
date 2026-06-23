/**
 * Email template system for SIAC-SAIME.
 *
 * Uses a single unified HTML wrapper (from the SAIME brand design)
 * with variable content sections per email type.
 *
 * The wrapper contains:
 *  - Brand stripe (🇻🇪 tricolor)
 *  - SAIME + SIAC header
 *  - Variable body (salutation, message, case card)
 *  - Institutional note
 *  - Official footer
 */

import { SENT_EMAIL_CONFIG } from "../config/sent-email.constants";

const { REASONS } = SENT_EMAIL_CONFIG;

/**
 * Formats a date string for display in emails (Spanish locale).
 * @param {string|Date} date
 * @returns {string}
 */
function formatDateSpanish(date) {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Renders the unified HTML email wrapper.
 *
 * @param {Object} params
 * @param {string} params.citizenName - Full name of the citizen.
 * @param {string} params.bodyMessage - The contextual message (HTML allowed).
 * @param {Object} [params.caseCard] - Data for the case info card.
 * @param {string} [params.caseCard.number] - Case request number.
 * @param {string} [params.caseCard.date] - Case registration date.
 * @param {string} [params.caseCard.reason] - Motive / procedure.
 * @param {string} [params.caseCard.status] - Current status.
 * @returns {string} Full HTML email string.
 */
function renderWrapper({ citizenName, bodyMessage, caseCard }) {
  const caseCardHtml = caseCard
    ? `
      <div class="case-card">
        <table>
          ${caseCard.number ? `<tr><td class="label">Número de Caso:</td><td class="value" style="font-family: monospace; font-size: 16px; color: #0f2c59; font-weight: bold;">${caseCard.number}</td></tr>` : ""}
          ${caseCard.date ? `<tr><td class="label">Fecha de Registro:</td><td class="value">${formatDateSpanish(caseCard.date)}</td></tr>` : ""}
          ${caseCard.reason ? `<tr><td class="label">Motivo / Trámite:</td><td class="value">${caseCard.reason}</td></tr>` : ""}
          ${caseCard.status ? `<tr><td class="label">Estatus:</td><td><span class="badge">${caseCard.status}</span></td></tr>` : ""}
        </table>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificación SIAC - SAIME</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f6f9;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333333;
            -webkit-font-smoothing: antialiased;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f6f9;
            padding-top: 40px;
            padding-bottom: 40px;
        }
        .main-table {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
        }
        .brand-stripe {
            height: 4px;
            background: linear-gradient(to right, #003893 33.3%, #f8c300 33.3%, #f8c300 66.6%, #ce1126 66.6%);
        }
        .header {
            background-color: #0f2c59;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            font-size: 22px;
            margin: 0;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .header p {
            color: #cbd5e1;
            font-size: 13px;
            margin: 5px 0 0 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
        }
        .welcome-text {
            font-size: 16px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 25px;
        }
        .highlight {
            color: #0f2c59;
            font-weight: bold;
        }
        .case-card {
            background-color: #f8fafc;
            border-left: 4px solid #0f2c59;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 30px;
        }
        .case-card tr td {
            padding: 8px 0;
            font-size: 14px;
            vertical-align: top;
        }
        .label {
            color: #64748b;
            font-weight: 600;
            width: 35%;
        }
        .value {
            color: #1e293b;
            font-weight: 500;
        }
        .badge {
            background-color: #dcfce7;
            color: #15803d;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
        }
        .info-note {
            font-size: 13px;
            line-height: 1.5;
            color: #64748b;
            background-color: #fffbeb;
            border: 1px solid #fef3c7;
            padding: 15px;
            border-radius: 6px;
        }
        .footer {
            background-color: #f1f5f9;
            padding: 25px 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
        .footer p {
            margin: 5px 0;
            line-height: 1.4;
        }
        .footer .bold-info {
            color: #64748b;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <table role="presentation" class="wrapper">
        <tr>
            <td>
                <table role="presentation" class="main-table">
                    <tr>
                        <td class="brand-stripe"></td>
                    </tr>
                    <tr>
                        <td class="header">
                            <h1>SAIME</h1>
                            <p>Sistema de Atención al Ciudadano (SIAC)</p>
                        </td>
                    </tr>
                    <tr>
                        <td class="content">
                            <p class="welcome-text">
                                Estimado(a) ciudadano(a), <span class="highlight">${citizenName}</span>:
                            </p>
                            <p class="welcome-text">
                                ${bodyMessage}
                            </p>
                            ${caseCardHtml}
                            <div class="info-note">
                                <strong>Nota institucional:</strong> No es necesario que responda a este correo electrónico. El sistema le notificará de forma automática tan pronto como se genere un cambio de estatus o respuesta formal a su caso.
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td class="footer">
                            <p class="bold-info">Servicio Administrativo de Identificación, Migración y Extranjería (SAIME)</p>
                            <p>Sede Central, Av. Baralt, Caracas, Distrito Capital, Venezuela.</p>
                            <p style="margin-top: 15px; font-size: 11px;">Este mensaje y sus archivos adjuntos son confidenciales y para uso exclusivo del destinatario original.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}

/**
 * Builds an email subject and HTML body for a given email type.
 *
 * @param {Object} params
 * @param {string} params.type - One of SENT_EMAIL_CONFIG.REASONS.
 * @param {Object} params.data - Template variables (citizenName, caseNumber, caseDate, reason, status, directionName, attentionType).
 * @returns {{ subject: string, html: string }}
 */
export function buildEmail({ type, data }) {
  const { citizenName, caseNumber, caseDate, reason, status, directionName, attentionType } = data;

  const caseCard = {
    number: caseNumber,
    date: caseDate,
    reason: reason || attentionType,
    status,
  };

  switch (type) {
    case REASONS.CASE_CREATED:
      return {
        subject: `Su caso ha sido registrado — SAIME`,
        html: renderWrapper({
          citizenName,
          bodyMessage:
            `Le informamos que su requerimiento ha sido registrado exitosamente en nuestra plataforma de <strong>Atención al Ciudadano</strong>. Nuestro equipo técnico y operativo se encuentra evaluando los detalles suministrados para brindarle una respuesta oportuna.`,
          caseCard,
        }),
      };

    case REASONS.CASE_CLOSED:
      return {
        subject: `Su caso ha sido cerrado — SAIME`,
        html: renderWrapper({
          citizenName,
          bodyMessage:
            `Le informamos que su caso <strong>${caseNumber}</strong> ha sido cerrado. Si considera que el cierre no corresponde o requiere asistencia adicional, puede acercarse a nuestras oficinas o abrir un nuevo caso en nuestro sistema.`,
          caseCard,
        }),
      };

    case REASONS.CASE_FORWARDED:
      return {
        subject: `Su caso ha sido remitido — SAIME`,
        html: renderWrapper({
          citizenName,
          bodyMessage:
            `Le informamos que su caso <strong>${caseNumber}</strong> ha sido remitido a <strong>${directionName || "la dirección correspondiente"}</strong> para su debida atención y seguimiento.`,
          caseCard,
        }),
      };

    case REASONS.CASE_UPDATED:
      return {
        subject: `Actualización de su caso — SAIME`,
        html: renderWrapper({
          citizenName,
          bodyMessage:
            `Le informamos que se ha registrado una actualización en su caso <strong>${caseNumber}</strong>. Puede consultar el detalle de la misma a través de nuestro sistema de atención al ciudadano.`,
          caseCard,
        }),
      };

    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}

/**
 * Returns a human-readable label for an email reason.
 * @param {string} reason - One of SENT_EMAIL_CONFIG.REASONS.
 * @returns {string}
 */
export function getReasonLabel(reason) {
  const map = {
    [REASONS.CASE_CREATED]: "Caso Creado",
    [REASONS.CASE_CLOSED]: "Caso Cerrado",
    [REASONS.CASE_FORWARDED]: "Caso Remitido",
    [REASONS.CASE_UPDATED]: "Caso Actualizado",
  };
  return map[reason] || reason;
}
