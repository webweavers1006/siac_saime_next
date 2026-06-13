import { permissionReadRepository } from "../repositories/permission.read.repository";

/**
 * Verifies if a role has access to a specific permission (Backend Check).
 */
export async function verifyPermission(roleName, requiredSlug) {
  if (!requiredSlug) return true;

  const count = await permissionReadRepository.countRolePermission(roleName, requiredSlug);
  return count > 0;
}

/**
 * Retrieves all permissions assigned to a role (Frontend Load).
 */
export async function getUserPermissions(roleName) {
  if (!roleName) return [];

  const permissions = await permissionReadRepository.findPermissionsByRole(roleName);
  return permissions.map(p => p.slug);
}
