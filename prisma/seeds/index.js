/**
 * seeds/index.js — Main seed orchestrator
 *
 * Runs all seed phases in order:
 *   1. Catalogs (countries, statuses, channels, entities, directions, offices…)
 *   2. Geography (states, municipalities, parishes)
 *   3. Persons (third parties + case persons)
 *   4. Auth (roles, permissions, admin user)
 *   5. Cases (sample cases with follow-ups, documents, notifications…)
 *
 * Usage:
 *   node prisma/seeds/index.js              → interactive prompt
 *   node prisma/seeds/index.js --clean      → clean + seed
 *   node prisma/seeds/index.js --supplement → upsert only
 */

require('dotenv').config()

const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')
const { askSeedMode } = require('./lib/prompt')
const { cleanupAll, resetAllSequences } = require('./lib/cleanup')
const { ADMIN_USER } = require('./data/auth')

const { seedCatalogs, seedOffices } = require('./seed-catalogs')
const { seedGeography } = require('./seed-geography')
const { seedPersons } = require('./seed-persons')
const { seedAuth } = require('./seed-auth')
const { seedOperatorUsers } = require('./seed-users-operator')
const { seedCases } = require('./seed-cases')
const { seedGeoData } = require('./seed-geo-data')

async function main() {
  // ── Determine mode: CLI args > interactive prompt > default ──────────────
  const cliArg = process.argv[2]

  let mode
  if (cliArg === '--clean' || cliArg === '--supplement') {
    mode = cliArg.replace('--', '')
    log.info(`ℹ️  Modo "${mode}" especificado por CLI.\n`)
  } else {
    mode = await askSeedMode()
  }

  if (mode === 'clean') {
    await cleanupAll(prisma)
  } else {
    log.info('ℹ️  Modo complementar: se conservan los datos existentes.\n')
  }

  log.info('🌱 Iniciando seed del sistema…\n')

  // Phase 1: Base catalogs
  await seedCatalogs()

  // Phase 2: Venezuelan geography
  await seedGeography()

  // Phase 2.1: Offices (depends on states from Phase 2)
  await seedOffices()

  // Phase 2.5: INE codes + GeoJSON polygons
  await seedGeoData()

  // Phase 3: Persons (third parties)
  await seedPersons()

  // Phase 4: Auth — Roles, Permissions, Admin User (required by Cases)
  const { adminUser, adminRole } = await seedAuth()

  // Phase 4.1: Operator users from OATC payroll
  await seedOperatorUsers()

  // Phase 5: Sample cases with related entities
  await seedCases(adminUser, adminRole)

  // ── Reset autoincrement sequences to avoid unique constraint violations ──
  log.info('\n  🔄 Sincronizando secuencias autoincrementales…')
  await resetAllSequences(prisma)
  log.success('  ✓ Secuencias sincronizadas')

  log.info('\n✅ Seed completado exitosamente.\n')
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  log.info('📋 Credenciales por defecto:')
  log.info(`   Email:    ${ADMIN_USER.email}`)
  log.info('   Password: ******** (definido en ADMIN_USER)')
  log.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    log.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
