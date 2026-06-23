/**
 * seed-catalogs.js — Phase 1: Base catalogs
 *
 * Seeds: Countries, CaseStatuses, CallStatuses, AttentionChannels,
 * AttachedEntities, PopularOrganizations, BeneficiaryTypes, CaseAreas,
 * Reasons, AttentionTypes, AttentionTypeDetails, AdministrativeDirections,
 * DirectionAreas (M2M), Offices.
 */

const path = require('path')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')

const SEED_DATA = path.resolve(__dirname, '..', 'seed-data')

async function seedCountries() {
  const data = require(path.join(SEED_DATA, 'countries.json'))
  log.info('  🌍 Países...')
  for (const item of data) {
    await prisma.country.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} países`)
}

async function seedCaseStatuses() {
  const data = require(path.join(SEED_DATA, 'case-statuses.json'))
  log.info('  📊 Estatus de caso...')
  for (const item of data) {
    await prisma.caseStatus.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} estatus`)
}

async function seedCallStatuses() {
  const data = require(path.join(SEED_DATA, 'call-statuses.json'))
  log.info('  📞 Estatus de llamada...')
  for (const item of data) {
    await prisma.callStatus.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} estatus`)
}

async function seedAttentionChannels() {
  const data = require(path.join(SEED_DATA, 'attention-channels.json'))
  log.info('  📡 Canales de atención...')
  for (const item of data) {
    await prisma.attentionChannel.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} canales`)
}

async function seedAttachedEntities() {
  const data = require(path.join(SEED_DATA, 'attached-entities.json'))
  log.info('  🏛️ Entes adscritos...')
  for (const item of data) {
    await prisma.attachedEntity.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} entes`)
}

async function seedPopularOrganizations() {
  const data = require(path.join(SEED_DATA, 'popular-organizations.json'))
  log.info('  🏘️ Organizaciones de poder popular...')
  for (const item of data) {
    await prisma.popularOrganization.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} organizaciones`)
}

async function seedBeneficiaryTypes() {
  const data = require(path.join(SEED_DATA, 'beneficiary-types.json'))
  log.info('  👥 Tipos de beneficiario...')
  for (const item of data) {
    await prisma.beneficiaryType.upsert({
      where: { id: item.id },
      update: { name: item.name, requiresIdCard: item.requiresIdCard },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} tipos`)
}

async function seedCaseAreas() {
  const data = require(path.join(SEED_DATA, 'case-areas.json'))
  log.info('  📁 Áreas de caso...')
  for (const item of data) {
    await prisma.caseArea.upsert({
      where: { id: item.id },
      update: { name: item.name },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} áreas`)
}

async function seedReasons() {
  const data = require(path.join(SEED_DATA, 'reasons.json'))
  log.info('  🏷️ Motivos...')
  for (const item of data) {
    await prisma.reason.upsert({
      where: { id: item.id },
      update: { name: item.name, caseAreaId: item.caseAreaId },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} motivos`)
}

async function seedAttentionTypes() {
  const data = require(path.join(SEED_DATA, 'attention-types.json'))
  log.info('  🎯 Tipos de atención...')
  for (const item of data) {
    await prisma.attentionType.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        showCaseArea: item.showCaseArea,
        showParticipants: item.showParticipants,
        sendEmail: item.sendEmail,
        showPopularOrg: item.showPopularOrg,
        showCoordinates: item.showCoordinates,
        showDocuments: item.showDocuments,
        showPuntoCuenta: item.showPuntoCuenta,
        hasComplaint: item.hasComplaint,
        hasAttentionDetail: item.hasAttentionDetail,
        deletedAt: null,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} tipos`)
}

async function seedAttentionTypeDetails() {
  const data = require(path.join(SEED_DATA, 'attention-type-details.json'))
  log.info('  📋 Detalles de tipo de atención...')
  for (const item of data) {
    await prisma.attentionTypeDetail.upsert({
      where: { id: item.id },
      update: { name: item.name, attentionTypeId: item.attentionTypeId },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} detalles`)
}

async function seedAdministrativeDirections() {
  const data = require(path.join(SEED_DATA, 'administrative-directions.json'))
  log.info('  🏢 Direcciones administrativas...')
  for (const item of data) {
    await prisma.administrativeDirection.upsert({
      where: { id: item.id },
      update: { name: item.name, email: item.email, isAudit: item.isAudit },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} direcciones`)
}

async function seedDirectionAreas() {
  const data = require(path.join(SEED_DATA, 'direction-areas.json'))
  log.info('  🔗 Relaciones dirección-área...')
  for (const item of data) {
    await prisma.directionArea.upsert({
      where: { directionId_areaId: { directionId: item.directionId, areaId: item.areaId } },
      update: {},
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} relaciones`)
}

async function seedOffices() {
  const data = require(path.join(SEED_DATA, 'offices.json'))
  log.info('  🏬 Oficinas...')
  let nullCodeCounter = 0
  for (const item of data) {
    // Generate a synthetic code for offices without one (e.g. GUARATARO, CAICARA)
    const code = item.code || `NC${String(++nullCodeCounter).padStart(2, '0')}`
    await prisma.office.upsert({
      where: { code },
      update: {
        name: item.name,
        address: item.address,
        stateId: item.stateId,
        chiefName: item.chiefName,
        chiefIdCard: item.chiefIdCard,
        chiefPhone: item.chiefPhone,
        chiefEmail: item.chiefEmail,
        hasEmailChange: item.hasEmailChange,
        hasForeignAffairs: item.hasForeignAffairs,
        hasMigration: item.hasMigration,
        observation: item.observation,
        isActive: item.isActive,
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
      },
      create: {
        name: item.name,
        code,
        address: item.address,
        stateId: item.stateId,
        chiefName: item.chiefName,
        chiefIdCard: item.chiefIdCard,
        chiefPhone: item.chiefPhone,
        chiefEmail: item.chiefEmail,
        hasEmailChange: item.hasEmailChange,
        hasForeignAffairs: item.hasForeignAffairs,
        hasMigration: item.hasMigration,
        observation: item.observation,
        isActive: item.isActive,
        lastUpdatedAt: item.lastUpdatedAt ? new Date(item.lastUpdatedAt) : null,
      },
    })
  }
  log.success(`  ✓ ${data.length} oficinas`)
}

/**
 * Main catalogs seed — runs all catalog sub-seeds in order.
 */
async function seedCatalogs() {
  log.info('📌 Sembrando catálogos base (Fase 1)...\n')

  await seedCountries()
  await seedCaseStatuses()
  await seedCallStatuses()
  await seedAttentionChannels()
  await seedAttachedEntities()
  await seedPopularOrganizations()
  await seedBeneficiaryTypes()
  await seedCaseAreas()
  await seedReasons()
  await seedAttentionTypes()
  await seedAttentionTypeDetails()
  await seedAdministrativeDirections()
  await seedDirectionAreas()
  // Offices moved to after seedGeography (Fase 2) — they depend on states

  log.info('')
}

module.exports = { seedCatalogs, seedOffices }

// Standalone execution: node prisma/seeds/seed-catalogs.js
if (require.main === module) {
  require('dotenv').config()
  const { prisma } = require('./lib/prisma')
  seedCatalogs()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
