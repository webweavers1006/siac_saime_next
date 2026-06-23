// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { ATTENTION_TYPE_DETAIL_CONFIG } from './config/attention-type-detail.constants'
export { getAttentionTypeDetailTableColumns } from './config/attention-type-detail.columns'
