import prisma from "@/features/shared/lib/prisma";
import { permissionMapper } from "../mappers/permission.mapper";

/**
 * Repository for Permission Read Operations.
 * Uses English field names — Prisma @map handles DB translation internally.
 */
export const permissionReadRepository = {
  async findAll() {
    const rawPermissions = await prisma.permission.findMany({
      orderBy: { slug: "asc" },
      select: {
        id: true,
        slug: true,
        description: true,
      },
    });
    return permissionMapper.toDomainList(rawPermissions);
  },

  async countRolePermission(roleName, slug) {
    return await prisma.rolePermission.count({
      where: {
        role: { name: roleName },
        permission: { slug }
      }
    });
  },

  async findPermissionsByRole(roleName) {
    const permissions = await prisma.rolePermission.findMany({
      where: {
        role: { name: roleName }
      },
      include: {
        permission: true
      }
    });

    return permissions.map(p => permissionMapper.toDomain(p.permission));
  }
};
