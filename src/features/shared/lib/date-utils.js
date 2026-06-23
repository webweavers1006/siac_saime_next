/**
 * Centralized Date/Time Utilities — Venezuela Timezone (America/Caracas, UTC-4)
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * SINGLE SOURCE OF TRUTH for ALL date/time handling across the project.
 * Every module MUST use these functions. NO inline new Date(), toISOString(),
 * getTimezoneOffset(), or manual formatting anywhere else.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Design:
 * - All formatting uses Intl.DateTimeFormat with timeZone: 'America/Caracas'.
 *   This works regardless of the server's TZ environment variable.
 * - @db.Date columns (DATE type, no time): use parseDateInput() to create a
 *   Date at Caracas midnight, then Prisma stores the correct date.
 * - @db.Timestamptz columns: use nowVE() or let the DB handle it via
 *   @default(now()) / @updatedAt — these are timezone-aware.
 */

const TIMEZONE = 'America/Caracas'

// ── Formatters (cached for performance) ──────────────────────────────────

const dateFormatter = new Intl.DateTimeFormat('es-VE', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const timeFormatter = new Intl.DateTimeFormat('es-VE', {
  timeZone: TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-VE', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Returns the current date string in Venezuela timezone (YYYY-MM-DD).
 * Use for: form defaults, date comparisons, generating date-only strings.
 * @returns {string} e.g. "2026-06-23"
 */
export function todayVE() {
  const now = new Date()
  const parts = dateFormatter.formatToParts(now)
  const y = parts.find(p => p.type === 'year').value
  const m = parts.find(p => p.type === 'month').value
  const d = parts.find(p => p.type === 'day').value
  return `${y}-${m}-${d}`
}

/**
 * Returns the current time string in Venezuela timezone (HH:mm:ss).
 * Use for: audit time recording, time display.
 * @returns {string} e.g. "17:30:05"
 */
export function nowTimeVE() {
  const now = new Date()
  const parts = timeFormatter.formatToParts(now)
  const h = parts.find(p => p.type === 'hour').value
  const m = parts.find(p => p.type === 'minute').value
  const s = parts.find(p => p.type === 'second').value
  return `${h}:${m}:${s}`
}

/**
 * Returns the current date AND time as form-ready strings.
 * Use for: pre-filling date/time inputs.
 * @returns {{ date: string, time: string }} date as YYYY-MM-DD, time as HH:mm
 */
export function getNowDefaults() {
  const now = new Date()
  const dateParts = dateFormatter.formatToParts(now)
  const timeParts = timeFormatter.formatToParts(now)
  const y = dateParts.find(p => p.type === 'year').value
  const m = dateParts.find(p => p.type === 'month').value
  const d = dateParts.find(p => p.type === 'day').value
  const hh = timeParts.find(p => p.type === 'hour').value
  const mm = timeParts.find(p => p.type === 'minute').value
  return {
    date: `${y}-${m}-${d}`,
    time: `${hh}:${mm}`,
  }
}

/**
 * Returns the current Date object adjusted to Venezuela timezone.
 * Use for: creating audit entries, soft-delete timestamps.
 * @returns {Date}
 */
export function nowVE() {
  return new Date()
}

// ── Date Parsing (for @db.Date columns) ──────────────────────────────────

/**
 * Parses a date string (YYYY-MM-DD) into a Date object at Caracas midnight.
 * Use for: converting form date strings to Prisma @db.Date values.
 *
 * IMPORTANT: Do NOT use bare new Date("YYYY-MM-DD") — its behavior depends
 * on the server TZ. This function always produces the correct Venezuela date.
 *
 * @param {string} dateStr - Date string in YYYY-MM-DD format.
 * @returns {Date|null} Date object at Caracas midnight, or null if invalid.
 */
export function parseDateInput(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return null
  // Create at 00:00 Caracas time (04:00 UTC)
  const [_, y, m, d] = match
  return new Date(`${y}-${m}-${d}T00:00:00-04:00`)
}

/**
 * Converts any Date to a YYYY-MM-DD string in Venezuela timezone.
 * Use for: extracting date portion for display or form inputs.
 * @param {Date|string} input - Date object or ISO string.
 * @returns {string} e.g. "2026-06-23" or empty string if invalid.
 */
export function toDateInput(input) {
  if (!input) return ''
  const date = input instanceof Date ? input : new Date(input)
  if (isNaN(date.getTime())) return ''
  const parts = dateFormatter.formatToParts(date)
  const y = parts.find(p => p.type === 'year').value
  const m = parts.find(p => p.type === 'month').value
  const d = parts.find(p => p.type === 'day').value
  return `${y}-${m}-${d}`
}

// ── Date Formatting (for UI display) ─────────────────────────────────────

/**
 * Formats a date for display in dd/MM/yyyy using Venezuela timezone.
 * Use for: table columns, detail views, list items — ANY user-facing date.
 *
 * @param {Date|string} input - Date object, ISO string, or YYYY-MM-DD string.
 * @param {string} [format='dd/MM/yyyy'] - Format preset: 'dd/MM/yyyy', 'dd/MM/yyyy HH:mm', or 'HH:mm'.
 * @returns {string} Formatted date string, or "—" if invalid.
 */
export function formatDate(input, format = 'dd/MM/yyyy') {
  if (!input) return '—'
  const date = input instanceof Date ? input : new Date(input)
  if (isNaN(date.getTime())) return '—'

  if (format === 'HH:mm') {
    const parts = timeFormatter.formatToParts(date)
    const h = parts.find(p => p.type === 'hour').value
    const m = parts.find(p => p.type === 'minute').value
    return `${h}:${m}`
  }

  if (format === 'dd/MM/yyyy HH:mm') {
    const parts = dateTimeFormatter.formatToParts(date)
    const day = parts.find(p => p.type === 'day').value
    const month = parts.find(p => p.type === 'month').value
    const year = parts.find(p => p.type === 'year').value
    const hour = parts.find(p => p.type === 'hour').value
    const minute = parts.find(p => p.type === 'minute').value
    return `${day}/${month}/${year} ${hour}:${minute}`
  }

  // Default: dd/MM/yyyy
  const parts = dateFormatter.formatToParts(date)
  const day = parts.find(p => p.type === 'day').value
  const month = parts.find(p => p.type === 'month').value
  const year = parts.find(p => p.type === 'year').value
  return `${day}/${month}/${year}`
}

/**
 * @deprecated Use formatDate(input, 'dd/MM/yyyy') instead.
 * Kept for backward compatibility during migration.
 */
export function formatDateUTC(input, fmt) {
  return formatDate(input, fmt)
}

/**
 * Formats ONLY the time portion of a Date for display (HH:mm).
 * @param {Date|string} input
 * @returns {string} e.g. "17:30" or "--:--" if invalid.
 */
export function formatTime(input) {
  return formatDate(input, 'HH:mm')
}

/**
 * @deprecated Use formatTime(input) instead.
 */
export function formatTimeUTC(input) {
  return formatTime(input)
}

// ── Time Parsing ─────────────────────────────────────────────────────────

/**
 * Convierte un string de hora en formato "HH:mm" a un objeto Date.
 * @param {string} timeStr - Hora en formato "HH:mm"
 * @returns {Date|null} Objeto Date con la hora establecida o null si no es válido.
 */
export function parseTime(timeStr) {
  if (!timeStr) return null
  const [h, m] = timeStr.split(':')
  const d = new Date()
  d.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0)
  return d
}

// ── Utility ──────────────────────────────────────────────────────────────

/**
 * Formatea minutos a formato legible (ej: 90 → "1h 30m").
 * @param {number} mins
 * @returns {string}
 */
export function formatHM(mins) {
  const m = Number(mins) || 0
  const h = Math.floor(m / 60)
  return `${h}h ${m % 60}m`
}

/**
 * Returns the current year in Venezuela timezone.
 * @returns {number} e.g. 2026
 */
export function currentYearVE() {
  const parts = dateFormatter.formatToParts(new Date())
  return parseInt(parts.find(p => p.type === 'year').value, 10)
}

/**
 * Formats a date as a human-readable relative time string.
 * Use for: notification timestamps, "last seen" indicators.
 *
 * @param {Date|string} dateStr - Date object or ISO string.
 * @param {Object} [opts] - Label overrides for i18n.
 * @param {string} [opts.justNow] - Label for < 1 minute ago.
 * @param {Function} [opts.minutes] - (n) => label for n minutes ago.
 * @param {Function} [opts.hours] - (n) => label for n hours ago.
 * @param {Function} [opts.days] - (n) => label for n days ago.
 * @returns {string} Relative time string (e.g. "Hace 5 min", "Hace 2h", "Hace 3 d").
 */
export function formatRelativeTime(dateStr, opts = {}) {
  if (!dateStr) return "";

  const now = Date.now();
  const then = new Date(dateStr).getTime();
  if (isNaN(then)) return "";

  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const {
    justNow = "Ahora",
    minutes = (n) => `Hace ${n} min`,
    hours = (n) => `Hace ${n}h`,
    days = (n) => `Hace ${n}d`,
  } = opts;

  if (diffMin < 1) return justNow;
  if (diffMin < 60) return minutes(diffMin);
  if (diffHrs < 24) return hours(diffHrs);
  return days(diffDays);
}
