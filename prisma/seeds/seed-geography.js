/**
 * seed-geography.js — Phase 2: Venezuelan geography
 *
 * Seeds: States (26), Municipalities (336), Parishes (1135).
 */

const path = require('path')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')

const SEED_DATA = path.resolve(__dirname, '..', 'seed-data')

async function seedStates() {
  const data = require(path.join(SEED_DATA, 'states.json'))
  log.info('  🗺️ Estados...')
  for (const item of data) {
    await prisma.state.upsert({
      where: { id: item.id },
      update: { name: item.name, countryId: item.countryId },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} estados`)
}

async function seedMunicipalities() {
  const data = require(path.join(SEED_DATA, 'municipalities.json'))
  log.info('  🏙️ Municipios...')
  for (const item of data) {
    await prisma.municipality.upsert({
      where: { id: item.id },
      update: { name: item.name, stateId: item.stateId },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} municipios`)
}

async function seedParishes() {
  const data = require(path.join(SEED_DATA, 'parishes.json'))
  log.info('  🏘️ Parroquias...')
  for (const item of data) {
    await prisma.parish.upsert({
      where: { id: item.id },
      update: { name: item.name, municipalityId: item.municipalityId },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} parroquias`)
}

async function seedGeography() {
  log.info('📌 Sembrando geografía (Fase 2)...\n')

  await seedStates()
  await seedMunicipalities()
  await seedParishes()

  log.info('')
}

module.exports = { seedGeography }

// Standalone execution: node prisma/seeds/seed-geography.js
if (require.main === module) {
  require('dotenv').config()
  const { prisma } = require('./lib/prisma')
  seedGeography()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
