/**
 * seed-users-operator.js — Operator Users seed
 *
 * Creates operator users from the OATC payroll Excel data.
 * All users get the OPERADOR role, assigned to OAC direction
 * and "Oficina Presencial" attention channel.
 *
 * Run AFTER seedAuth() (roles must exist).
 */

const path = require('path')
const bcrypt = require('bcryptjs')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')

const SEED_DATA = path.resolve(__dirname, '..', 'seed-data')

async function seedOperatorUsers() {
  const data = require(path.join(SEED_DATA, 'users-operators.json'))
  log.info('\n📌 Creando usuarios operadores (OATC)...')

  // Resolve the OPERADOR role
  const operadorRole = await prisma.role.findUnique({ where: { name: 'OPERADOR' } })
  if (!operadorRole) {
    log.error('  ❌ Rol OPERADOR no encontrado. Ejecuta seedAuth() primero.')
    return
  }

  let created = 0
  for (const item of data) {
    const hashedPassword = await bcrypt.hash(item.password, 10)
    await prisma.user.upsert({
      where: { email: item.email },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        password: hashedPassword,
        roleId: operadorRole.id,
        administrativeDirectionId: 1,
        attentionChannelId: item.attentionChannelId || 1,
      },
      create: {
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        idCard: item.idCard,
        password: hashedPassword,
        roleId: operadorRole.id,
        administrativeDirectionId: 1,
        attentionChannelId: item.attentionChannelId || 1,
      },
    })
    created++
  }

  log.success(`  ✓ ${created} usuarios operadores creados`)
  log.info(`  🔑 Contraseña: cédula de cada usuario`)
  log.info('')
}

module.exports = { seedOperatorUsers }

// Standalone execution
if (require.main === module) {
  require('dotenv').config()
  seedOperatorUsers()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
