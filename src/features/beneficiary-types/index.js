// ⚠️ Safe barrel: only config, constants, and columns.
// Server-only functions (prisma, actions) must be imported by direct path.
export { BENEFICIARY_TYPE_CONFIG } from './config/beneficiary-type.constants'
export { getBeneficiaryTypeTableColumns } from './config/beneficiary-type.columns'
