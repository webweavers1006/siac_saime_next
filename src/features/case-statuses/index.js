// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { CASE_STATUS_CONFIG } from './config/case-status.constants'
export { getCaseStatusTableColumns } from './config/case-status.columns'
