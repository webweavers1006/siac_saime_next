require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { Pool } = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ─── Core Data ────────────────────────────────────────────────────────────────

const ROLES = [
  { name: 'ADMIN', description: 'Administrador del Sistema con acceso total' },
  { name: 'USER', description: 'Usuario estándar con acceso limitado' },
]

/**
 * System permissions grouped by module.
 */
const PERMISSIONS = [
  // Users module
  { slug: 'users:read', description: 'Ver listado propio de usuarios' },
  { slug: 'users:read_all', description: 'Ver todos los usuarios del sistema' },
  { slug: 'users:create', description: 'Crear nuevos usuarios' },
  { slug: 'users:update', description: 'Editar información de usuarios' },
  { slug: 'users:delete', description: 'Eliminar o desactivar usuarios' },

  // Roles module
  { slug: 'roles:read', description: 'Ver roles propios' },
  { slug: 'roles:read_all', description: 'Ver todos los roles del sistema' },
  { slug: 'roles:create', description: 'Crear nuevos roles' },
  { slug: 'roles:update', description: 'Editar roles existentes' },
  { slug: 'roles:delete', description: 'Eliminar roles del sistema' },
]

const ADMIN_USER = {
  firstName: 'Admin',
  lastName: 'Principal',
  email: 'admin@admin.starter',
  idCard: '000000000',
  password: 'admin123',
}

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Iniciando seed del sistema...\n')

  // 1. Crear Roles
  console.log('📌 Creando roles...')
  const createdRoles = {}
  for (const role of ROLES) {
    const created = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    })
    createdRoles[role.name] = created
    console.log(`  ✓ Rol: ${created.name}`)
  }

  // 2. Crear Permisos
  console.log('\n📌 Creando permisos...')
  const createdPermissions = {}
  for (const perm of PERMISSIONS) {
    const created = await prisma.permission.upsert({
      where: { slug: perm.slug },
      update: { description: perm.description },
      create: perm,
    })
    createdPermissions[perm.slug] = created
    console.log(`  ✓ Permiso: ${created.slug}`)
  }

  // 3. Asignar todos los permisos al rol ADMIN
  console.log('\n📌 Asignando permisos al rol ADMIN...')
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
  console.log(`  ✓ ${Object.keys(createdPermissions).length} permisos asignados a ADMIN`)

  // 4. Asignar permiso de lectura propio al rol USER
  console.log('\n📌 Asignando permisos al rol USER...')
  const userRole = createdRoles['USER']
  const userReadPerms = ['users:read', 'roles:read']
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
  console.log(`  ✓ Permisos de lectura asignados a USER`)

  // 5. Crear usuario Admin
  console.log('\n📌 Creando usuario administrador...')
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
    },
  })
  console.log(`  ✓ Usuario Admin: ${adminUser.email} / admin123`)

  console.log('\n✅ Seed completado exitosamente.\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Credenciales por defecto:')
  console.log('   Email:    admin@admin.starter')
  console.log('   Password: admin123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
