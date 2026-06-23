// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { PERSON_CONFIG } from './config/person.constants'
export { getPersonTableColumns } from './config/person.columns'
