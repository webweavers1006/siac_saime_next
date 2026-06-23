/**
 * seed-auth.js — Authentication & Authorization seed
 *
 * Seeds: Roles, Permissions, RolePermissions (M2M), and default Admin User.
 * Must run AFTER catalogs and BEFORE cases (cases need the admin user).
 */

const bcrypt = require('bcryptjs')
const { prisma } = require('./lib/prisma')
const { log } = require('./lib/logger')
const { ROLES, PERMISSIONS, ADMIN_USER } = require('./data/auth')

async function seedAuth() {
  // 1. Create Roles
  log.info('📌 Creando roles...')
  const createdRoles = {}
  for (const role of ROLES) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    })
    createdRoles[role.name] = created
    log.success(`  ✓ Rol: ${created.name}`)
  }

  // 2. Create Permissions
  log.info('\n📌 Creando permisos...')
  const createdPermissions = {}
  for (const perm of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { description: perm.description },
      create: perm,
    })
    createdPermissions[perm.slug] = created
    log.success(`  ✓ Permiso: ${created.slug}`)
  }

  // 3. Assign ALL permissions to ADMIN role
  log.info('\n📌 Asignando permisos al rol ADMIN...')
  const adminRole = createdRoles['ADMIN']
  for (const perm of Object.values(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    })
  }
  log.success(`  ✓ ${Object.keys(createdPermissions).length} permisos asignados a ADMIN`)

  // 4. Assign read-only permissions to USER role
  log.info('\n📌 Asignando permisos al rol USER...')
  const userRole = createdRoles['USER']
  const userReadPerms = ['users:view', 'roles:view', 'users:read', 'roles:read']
  for (const slug of userReadPerms) {
    const perm = createdPermissions[slug]
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: userRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: userRole.id,
          permissionId: perm.id,
        },
      })
    }
  }
  log.success('  ✓ Permisos de lectura asignados a USER')

  // 4.1 Assign operator permissions to OPERADOR role
  log.info('\n📌 Asignando permisos al rol OPERADOR...')
  const operadorRole = createdRoles['OPERADOR']
  const operadorPerms = [
    // Visibilidad de módulos en sidebar
    'cases:view',
    'persons:view',
    // Personas: lectura (para el selector protegido), creación y edición
    'persons:read',
    'persons:create',
    'persons:update',
    // Casos: lectura propia, creación y edición (sin read_all ni delete)
    'cases:read',
    'cases:create',
    'cases:update',
    // Seguimientos: lectura y creación
    'case_follow_ups:read',
    'case_follow_ups:create',
    // Documentos: lectura y subida
    'case_documents:read',
    'case_documents:create',
  ]
  for (const slug of operadorPerms) {
    const perm = createdPermissions[slug]
    if (perm) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: operadorRole.id,
            permissionId: perm.id,
          },
        },
        update: {},
        create: {
          roleId: operadorRole.id,
          permissionId: perm.id,
        },
      })
    }
  }
  log.success(`  ✓ ${operadorPerms.length} permisos asignados a OPERADOR`)

  // 5. Create Admin User
  log.info('\n📌 Creando usuario administrador...')
  const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10)
  const adminUser = await prisma.user.upsert({
    where: { email: ADMIN_USER.email },
    update: {
      firstName: ADMIN_USER.firstName,
      lastName: ADMIN_USER.lastName,
      password: hashedPassword,
      roleId: adminRole.id,
    },
    create: {
      firstName: ADMIN_USER.firstName,
      lastName: ADMIN_USER.lastName,
      email: ADMIN_USER.email,
      idCard: ADMIN_USER.idCard,
      password: hashedPassword,
      roleId: adminRole.id,
      administrativeDirectionId: ADMIN_USER.administrativeDirectionId ?? null,
      attentionChannelId: ADMIN_USER.attentionChannelId ?? null,
    },
  })
  log.success(`  ✓ Usuario Admin: ${adminUser.email}`)

  log.info('')

  return { adminRole, createdRoles, createdPermissions, adminUser }
}

module.exports = { seedAuth }

// Standalone execution: node prisma/seeds/seed-auth.js
if (require.main === module) {
  require('dotenv').config()
  const { prisma } = require('./lib/prisma')
  seedAuth()
    .catch((e) => { log.error('❌ Error:', e); process.exit(1) })
    .finally(() => prisma.$disconnect())
}
