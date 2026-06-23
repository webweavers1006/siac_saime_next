// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { ADMINISTRATIVE_DIRECTION_CONFIG } from './config/administrative-direction.constants'
export { getAdministrativeDirectionTableColumns } from './config/administrative-direction.columns'
