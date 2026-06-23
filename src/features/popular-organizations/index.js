// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { POPULAR_ORGANIZATION_CONFIG } from './config/popular-organization.constants'
export { getPopularOrganizationTableColumns } from './config/popular-organization.columns'
