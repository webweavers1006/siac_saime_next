/**
 * seed-cases.js — Phase 4: Sample cases with related entities
 *
 * Seeds: Cases, CaseFollowUps, CaseDocuments, CaseCoordinates,
 * CaseForwards, Mediations, CaseParticipants, Notifications, AuditLogs.
 *
 * Requires: admin user and admin role from seedAuth().
 * All sample data lives in prisma/seed-data/*.json files.
 * Dynamic fields (userId, roleId) are injected at seed time.
 */

const path = require('path')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')

const SEED_DATA = path.resolve(__dirname, '..', 'seed-data')

async function seedCases(adminUser, adminRole) {
  log.info('📌 Sembrando casos (Fase 4)...\n')

  // ── Cases ──────────────────────────────────────────────────────────────
  const casesData = require(path.join(SEED_DATA, 'cases.json'))
  log.info('  📋 Casos...')

  // Resolve officeCode → officeId dynamically
  const officeCodes = [...new Set(casesData.map(c => c.officeCode).filter(Boolean))]
  const offices = await prisma.office.findMany({
    where: { code: { in: officeCodes } },
    select: { id: true, code: true },
  })
  const officeMap = Object.fromEntries(offices.map(o => [o.code, o.id]))

  for (const item of casesData) {
    const officeId = item.officeCode ? officeMap[item.officeCode] : item.officeId || null
    await prisma.case.upsert({
      where: { id: item.id },
      update: {
        requestNumber: item.requestNumber,
        description: item.description,
        caseDate: new Date(item.caseDate),
        caseTime: item.caseTime,
        personId: item.personId,
        userId: adminUser.id,
        caseStatusId: item.caseStatusId,
        caseAreaId: item.caseAreaId,
        reasonId: item.reasonId,
        attentionTypeId: item.attentionTypeId,
        attentionChannelId: item.attentionChannelId,
        officeId,
      },
      create: {
        id: item.id,
        requestNumber: item.requestNumber,
        description: item.description,
        caseDate: new Date(item.caseDate),
        caseTime: item.caseTime,
        personId: item.personId,
        caseStatusId: item.caseStatusId,
        caseAreaId: item.caseAreaId,
        reasonId: item.reasonId,
        attentionTypeId: item.attentionTypeId,
        attentionChannelId: item.attentionChannelId,
        officeId,
        userId: adminUser.id,
      },
    })
  }
  log.success(`  ✓ ${casesData.length} casos`)

  // ── Follow-ups ─────────────────────────────────────────────────────────
  const followUps = require(path.join(SEED_DATA, 'case-follow-ups.json'))
  log.info('  📞 Seguimientos...')
  for (const item of followUps) {
    await prisma.caseFollowUp.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        callStatusId: item.callStatusId,
        comment: item.comment,
        date: new Date(item.date),
        userId: adminUser.id,
      },
      create: {
        ...item,
        date: new Date(item.date),
        userId: adminUser.id,
      },
    })
  }
  log.success(`  ✓ ${followUps.length} seguimientos`)

  // ── Documents ──────────────────────────────────────────────────────────
  const documents = require(path.join(SEED_DATA, 'case-documents.json'))
  log.info('  📄 Documentos...')
  for (const item of documents) {
    await prisma.caseDocument.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        filePath: item.filePath,
        description: item.description,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${documents.length} documentos`)

  // ── Coordinates ────────────────────────────────────────────────────────
  const coordinates = require(path.join(SEED_DATA, 'case-coordinates.json'))
  log.info('  📍 Coordenadas...')
  for (const item of coordinates) {
    await prisma.caseCoordinate.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        userId: adminUser.id,
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
      },
      create: {
        ...item,
        userId: adminUser.id,
      },
    })
  }
  log.success(`  ✓ ${coordinates.length} coordenadas`)

  // ── Forwards ───────────────────────────────────────────────────────────
  const forwards = require(path.join(SEED_DATA, 'case-forwards.json'))
  log.info('  📤 Remisiones...')
  for (const item of forwards) {
    await prisma.caseForward.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        administrativeDirectionId: item.administrativeDirectionId,
        userId: adminUser.id,
        isActive: item.isActive,
        date: new Date(item.date),
      },
      create: {
        ...item,
        userId: adminUser.id,
        date: new Date(item.date),
      },
    })
  }
  log.success(`  ✓ ${forwards.length} remisiones`)

  // ── Mediations ─────────────────────────────────────────────────────────
  const mediations = require(path.join(SEED_DATA, 'mediations.json'))
  log.info('  🤝 Mediaciones...')
  for (const item of mediations) {
    await prisma.mediation.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        counterpartyId: item.counterpartyId,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${mediations.length} mediaciones`)

  // ── Participants ───────────────────────────────────────────────────────
  const participants = require(path.join(SEED_DATA, 'case-participants.json'))
  log.info('  👥 Participantes...')
  for (const item of participants) {
    await prisma.caseParticipant.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        personId: item.personId,
        popularOrganizationId: item.popularOrganizationId,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${participants.length} participantes`)

  // ── Notifications ──────────────────────────────────────────────────────
  const notifications = require(path.join(SEED_DATA, 'notifications.json'))
  log.info('  🔔 Notificaciones...')
  for (const item of notifications) {
    await prisma.notification.upsert({
      where: { id: item.id },
      update: {
        caseId: item.caseId,
        type: item.type,
        message: item.message,
        isRead: item.isRead,
        recipientUserId: adminUser.id,
        actionUserId: adminUser.id,
        actionRoleId: adminRole.id,
      },
      create: {
        ...item,
        recipientUserId: adminUser.id,
        actionUserId: adminUser.id,
        actionRoleId: adminRole.id,
      },
    })
  }
  log.success(`  ✓ ${notifications.length} notificaciones`)

  // ── Audit Logs ─────────────────────────────────────────────────────────
  const auditLogs = require(path.join(SEED_DATA, 'audit-logs.json'))
  log.info('  📝 Auditoría...')
  for (const item of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: item.id },
      update: {
        userId: adminUser.id,
        action: item.action,
        date: new Date(item.date),
        time: item.time,
      },
      create: {
        ...item,
        userId: adminUser.id,
        date: new Date(item.date),
      },
    })
  }
  log.success(`  ✓ ${auditLogs.length} registros de auditoría`)

  log.info('')
}

module.exports = { seedCases }

// Standalone execution: node prisma/seeds/seed-cases.js
if (require.main === module) {
  require('dotenv').config()
  const { prisma } = require('./lib/prisma')
  const { ADMIN_USER } = require('./data/auth')

  ;(async () => {
    const adminUser = await prisma.user.findUnique({ where: { email: ADMIN_USER.email } })
    if (!adminUser) {
      log.error('❌ Admin user not found. Run seed-auth.js first.')
      process.exit(1)
    }
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } })
    await seedCases(adminUser, adminRole)
  })()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
