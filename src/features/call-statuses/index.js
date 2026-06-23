// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { CALL_STATUS_CONFIG } from './config/call-status.constants'
export { getCallStatusTableColumns } from './config/call-status.columns'
