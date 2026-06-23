// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { OFFICE_CONFIG } from './config/offices.constants'
export { getOfficeTableColumns } from './config/offices.columns'
