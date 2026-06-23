// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { REASON_CONFIG } from './config/reason.constants'
export { getReasonTableColumns } from './config/reason.columns'
