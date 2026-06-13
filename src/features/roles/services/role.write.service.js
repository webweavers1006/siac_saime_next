import { 
  createRole as createRepo, 
  updateRole as updateRepo, 
  deleteRole as deleteRepo 
} from "../repositories/role.write.repository";
import { validateRoleName, validateRoleDeletion } from "./role.validation.service";
import { logger } from "@/features/shared";

/**
 * Creates a new role with permissions.
 */
export async function createRole(data) {
  try {
    const validation = await validateRoleName(data.name);
    if (!validation.success) return validation;

    const newRole = await createRepo(data);
    return { success: true, data: newRole, message: "Rol creado exitosamente." };
  } catch (error) {
    logger.error("Error creating role", { error: error.message });
    return { success: false, error: "Error al crear el rol." };
  }
}

/**
 * Actualiza un rol existente.
 */
export async function updateRole(id, data) {
  const roleId = parseInt(id);

  try {
    const validation = await validateRoleName(data.name, roleId);
    if (!validation.success) return validation;

    const updatedRole = await updateRepo(roleId, data);
    return { success: true, data: updatedRole, message: "Rol actualizado exitosamente." };
  } catch (error) {
    logger.error("Error updating role", { error: error.message, roleId });
    return { success: false, error: "Error al actualizar el rol." };
  }
}

/**
 * Deletes a role if it has no assigned users.
 */
export async function deleteRole(id) {
  const roleId = parseInt(id);

  try {
    const validation = await validateRoleDeletion(roleId);
    if (!validation.success) return validation;

    await deleteRepo(roleId);
    return { success: true, message: "Rol eliminado exitosamente." };
  } catch (error) {
    logger.error("Error deleting role", { error: error.message, roleId });
    return { success: false, error: "Error al eliminar el rol." };
  }
}
