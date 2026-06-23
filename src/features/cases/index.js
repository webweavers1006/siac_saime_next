// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { CASE_CONFIG } from './config/case.constants';
export { getCaseTableColumns } from './config/case.columns';
