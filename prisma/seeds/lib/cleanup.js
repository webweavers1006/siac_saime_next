/**
 * cleanup.js — Database cleanup module for seed system.
 *
 * Deletes ALL records from all tables in the correct FK-safe order.
 * Uses deleteMany() — respects soft-delete convention by doing hard deletes
 * (this is a seed/dev tool, not a business operation).
 *
 * Deletion order is reverse of creation order:
 *   1. Leaf tables (depend on others, nothing depends on them)
 *   2. Core entity tables (Case, Person, User)
 *   3. Junction tables (RolePermission, DirectionArea)
 *   4. Catalog tables
 *   5. Geography tables (reverse hierarchy)
 */

const { log } = require('./logger')
const { pool: sharedPool } = require('./prisma')

/**
 * Deletes all records from all tables in FK-safe order.
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
async function cleanupAll(prisma) {
  log.info('🧹 Iniciando limpieza completa de la base de datos…\n')

  // ── Level 1: Deepest leaf tables ───────────────────────────────────────
  log.info('  Nivel 1: Tablas hoja (auditoría, notificaciones, CGR)…')

  const auditCount = await prisma.auditLog.deleteMany()
  log.success(`  ✓ ${auditCount.count} registros de auditoría eliminados`)

  const notifCount = await prisma.notification.deleteMany()
  log.success(`  ✓ ${notifCount.count} notificaciones eliminadas`)

  const cgrCount = await prisma.cgrRecord.deleteMany()
  log.success(`  ✓ ${cgrCount.count} registros CGR eliminados`)

  // ── Level 2: Case children ─────────────────────────────────────────────
  log.info('\n  Nivel 2: Entidades hijas de caso…')

  const participantCount = await prisma.caseParticipant.deleteMany()
  log.success(`  ✓ ${participantCount.count} participantes eliminados`)

  const mediationCount = await prisma.mediation.deleteMany()
  log.success(`  ✓ ${mediationCount.count} mediaciones eliminadas`)

  const followUpCount = await prisma.caseFollowUp.deleteMany()
  log.success(`  ✓ ${followUpCount.count} seguimientos eliminados`)

  const docCount = await prisma.caseDocument.deleteMany()
  log.success(`  ✓ ${docCount.count} documentos eliminados`)

  const forwardCount = await prisma.caseForward.deleteMany()
  log.success(`  ✓ ${forwardCount.count} remisiones eliminadas`)

  const coordCount = await prisma.caseCoordinate.deleteMany()
  log.success(`  ✓ ${coordCount.count} coordenadas eliminadas`)

  const complaintCount = await prisma.caseComplaint.deleteMany()
  log.success(`  ✓ ${complaintCount.count} denuncias eliminadas`)

  // ── Level 3: Core entities (Case, Person, User) ────────────────────────
  log.info('\n  Nivel 3: Entidades principales…')

  const caseCount = await prisma.case.deleteMany()
  log.success(`  ✓ ${caseCount.count} casos eliminados`)

  const personCount = await prisma.person.deleteMany()
  log.success(`  ✓ ${personCount.count} personas eliminadas`)

  const userCount = await prisma.user.deleteMany()
  log.success(`  ✓ ${userCount.count} usuarios eliminados`)

  // ── Level 4: Junction tables ───────────────────────────────────────────
  log.info('\n  Nivel 4: Tablas pivote…')

  const rpCount = await prisma.rolePermission.deleteMany()
  log.success(`  ✓ ${rpCount.count} asignaciones rol-permiso eliminadas`)

  const daCount = await prisma.directionArea.deleteMany()
  log.success(`  ✓ ${daCount.count} relaciones dirección-área eliminadas`)

  // ── Level 5: Auth catalogs ─────────────────────────────────────────────
  log.info('\n  Nivel 5: Catálogos de autenticación…')

  const permCount = await prisma.permission.deleteMany()
  log.success(`  ✓ ${permCount.count} permisos eliminados`)

  const roleCount = await prisma.role.deleteMany()
  log.success(`  ✓ ${roleCount.count} roles eliminados`)

  // ── Level 6: Dependent catalogs (have FK to other catalogs) ────────────
  log.info('\n  Nivel 6: Catálogos dependientes…')

  const reasonCount = await prisma.reason.deleteMany()
  log.success(`  ✓ ${reasonCount.count} motivos eliminados`)

  const detailCount = await prisma.attentionTypeDetail.deleteMany()
  log.success(`  ✓ ${detailCount.count} detalles de tipo eliminados`)

  const dirCount = await prisma.administrativeDirection.deleteMany()
  log.success(`  ✓ ${dirCount.count} direcciones administrativas eliminadas`)

  // ── Level 7: Independent catalogs ──────────────────────────────────────
  log.info('\n  Nivel 7: Catálogos independientes…')

  const officeCount = await prisma.office.deleteMany()
  log.success(`  ✓ ${officeCount.count} oficinas eliminadas`)

  const atCount = await prisma.attentionType.deleteMany()
  log.success(`  ✓ ${atCount.count} tipos de atención eliminados`)

  const channelCount = await prisma.attentionChannel.deleteMany()
  log.success(`  ✓ ${channelCount.count} canales de atención eliminados`)

  const orgCount = await prisma.popularOrganization.deleteMany()
  log.success(`  ✓ ${orgCount.count} organizaciones populares eliminadas`)

  const entityCount = await prisma.attachedEntity.deleteMany()
  log.success(`  ✓ ${entityCount.count} entes adscritos eliminados`)

  const btCount = await prisma.beneficiaryType.deleteMany()
  log.success(`  ✓ ${btCount.count} tipos de beneficiario eliminados`)

  const areaCount = await prisma.caseArea.deleteMany()
  log.success(`  ✓ ${areaCount.count} áreas de caso eliminadas`)

  const csCount = await prisma.callStatus.deleteMany()
  log.success(`  ✓ ${csCount.count} estatus de llamada eliminados`)

  const statusCount = await prisma.caseStatus.deleteMany()
  log.success(`  ✓ ${statusCount.count} estatus de caso eliminados`)

  // ── Level 8: Geography (reverse hierarchy) ─────────────────────────────
  log.info('\n  Nivel 8: Geografía…')

  const parishCount = await prisma.parish.deleteMany()
  log.success(`  ✓ ${parishCount.count} parroquias eliminadas`)

  const munCount = await prisma.municipality.deleteMany()
  log.success(`  ✓ ${munCount.count} municipios eliminados`)

  const stateCount = await prisma.state.deleteMany()
  log.success(`  ✓ ${stateCount.count} estados eliminados`)

  const countryCount = await prisma.country.deleteMany()
  log.success(`  ✓ ${countryCount.count} países eliminados`)

  log.info('\n✅ Limpieza completa.\n')
}

/**
 * Resets all autoincrement sequences to be after the current max ID.
 * Prevents "Unique constraint failed on the fields: ('id')" after seeds
 * insert explicit IDs without advancing PostgreSQL sequences.
 *
 * Uses raw pg Pool (not Prisma) to avoid driver adapter raw query issues.
 *
 * @param {import('@prisma/client').PrismaClient} _prisma — unused, kept for API compatibility
 */
async function resetAllSequences(_prisma) {
  try {
    const tables = [
      'roles', 'permisos', 'paises', 'estatus_caso', 'estatus_llamada',
      'canales_atencion', 'entes_adscritos', 'org_poder_popular',
      'tipos_beneficiario', 'areas_caso', 'motivos', 'tipos_atencion',
      'tipos_atencion_detalle', 'direcciones_administrativas', 'oficinas',
      'estados', 'municipios', 'parroquias', 'personas',
      'denuncias_caso', 'coordenadas_caso', 'remisiones_caso',
      'documentos_caso', 'seguimientos_caso', 'mediaciones',
      'participantes_caso', 'registros_cgr', 'notificaciones', 'auditoria',
    ]

    const customColumns = [
      { table: 'casos', column: 'id_caso' },
    ]

    for (const table of tables) {
      try {
        await sharedPool.query(
          `SELECT setval('${table}_id_seq', COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, false)`
        )
      } catch (err) {
        log.warn(`  ⚠️  No se pudo resetear secuencia: ${table}_id_seq — ${err.message}`)
      }
    }

    for (const { table, column } of customColumns) {
      try {
        await sharedPool.query(
          `SELECT setval('${table}_${column}_seq', COALESCE((SELECT MAX(${column}) FROM ${table}), 0) + 1, false)`
        )
      } catch (err) {
        log.warn(`  ⚠️  No se pudo resetear secuencia: ${table}_${column}_seq — ${err.message}`)
      }
    }
  } catch (err) {
    log.warn(`  ⚠️  Error general en reset de secuencias: ${err.message}`)
  }
}

module.exports = { cleanupAll, resetAllSequences }
