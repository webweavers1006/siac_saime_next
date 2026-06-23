// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { ATTENTION_CHANNEL_CONFIG } from './config/attention-channel.constants'
export { getAttentionChannelTableColumns } from './config/attention-channel.columns'
