// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { CASE_AREA_CONFIG } from './config/case-area.constants'
export { getCaseAreaTableColumns } from './config/case-area.columns'
