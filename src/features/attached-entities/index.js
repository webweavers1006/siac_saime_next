// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { ATTACHED_ENTITY_CONFIG } from './config/attached-entity.constants'
export { getAttachedEntityTableColumns } from './config/attached-entity.columns'
