/**
 * seed-persons.js — Phase 3: Persons (third parties + case persons)
 *
 * Seeds: Person records from persons.json and case-persons.json.
 */

const path = require('path')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')

const SEED_DATA = path.resolve(__dirname, '..', 'seed-data')

async function seedPersons() {
  log.info('📌 Sembrando personas (Fase 3)...\n')

  const data = require(path.join(SEED_DATA, 'persons.json'))
  log.info('  👤 Personas (terceros)...')
  for (const item of data) {
    await prisma.person.upsert({
      where: { id: item.id },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        idCard: item.idCard,
        phone: item.phone,
        email: item.email,
        address: item.address,
        nationality: item.nationality,
        sex: item.sex,
        age: item.age,
        birthDate: item.birthDate,
        profession: item.profession,
        personType: item.personType,
        legalInfo: item.legalInfo,
        countryId: item.countryId,
        stateId: item.stateId,
        municipalityId: item.municipalityId,
        parishId: item.parishId,
        beneficiaryTypeId: item.beneficiaryTypeId,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${data.length} personas`)

  const casePersonData = require(path.join(SEED_DATA, 'case-persons.json'))
  log.info('  👤 Personas de caso...')
  for (const item of casePersonData) {
    await prisma.person.upsert({
      where: { id: item.id },
      update: {
        firstName: item.firstName,
        lastName: item.lastName,
        idCard: item.idCard,
        phone: item.phone,
        email: item.email,
        address: item.address,
        nationality: item.nationality,
        sex: item.sex,
        age: item.age,
        profession: item.profession,
        personType: item.personType,
        countryId: item.countryId,
        stateId: item.stateId,
        municipalityId: item.municipalityId,
        parishId: item.parishId,
        beneficiaryTypeId: item.beneficiaryTypeId,
      },
      create: item,
    })
  }
  log.success(`  ✓ ${casePersonData.length} personas de caso`)

  log.info('')
}

module.exports = { seedPersons }

// Standalone execution: node prisma/seeds/seed-persons.js
if (require.main === module) {
  require('dotenv').config()
  const { prisma } = require('./lib/prisma')
  seedPersons()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
