// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { ATTENTION_TYPE_CONFIG } from './config/attention-type.constants'
export { getAttentionTypeTableColumns } from './config/attention-type.columns'
