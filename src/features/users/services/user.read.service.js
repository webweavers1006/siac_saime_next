import { findUsersPaginated } from "../repositories/user.read.repository";
import { getAllRoles } from "@/features/roles/repositories/role.read.repository";
import { USER_CONFIG } from "../config/user.constants";
import { logger } from "@/features/shared";

/**
 * Obtiene los datos necesarios para la página de gestión de usuarios.
 * Retorna una lista de usuarios, por lo que se nombra con el sufijo 'List'.
 */
export async function fetchUsersList(
  currentUser,
  { page, pageSize, searchTerm, status, sortKey, sortDirection } = {}
) {
  try {
    const safePageSize = Number(pageSize) || USER_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;
    const safePage = Number(page) || 1;
    const safeSearchTerm = searchTerm?.trim() || "";
    const safeStatus = status || USER_CONFIG.STATUS.ALL;

    const [usersResult, roles] = await Promise.all([
      findUsersPaginated({
        page: safePage,
        pageSize: safePageSize,
        searchTerm: safeSearchTerm,
        status: safeStatus,
        sortKey,
        sortDirection
      }),
      getAllRoles()
    ]);

    return {
      users: usersResult.users,
      totalCount: usersResult.totalCount,
      page: usersResult.page,
      pageSize: usersResult.pageSize,
      totalPages: usersResult.totalPages,
      roles,
    };
  } catch (error) {
    logger.error("Failed to fetch users list", { error: error.message });
    return { users: [], roles: [], totalCount: 0, page: 1, totalPages: 1 };
  }
}

/**
 * Busca usuarios activos por nombre, apellido o cédula.
 */
export async function searchActiveUsersList(query) {
  if (!query || query.length < 2) return [];

  try {
    const usersResult = await findUsersPaginated({
      page: 1,
      pageSize: USER_CONFIG.PAGINATION.SEARCH_TAKE,
      searchTerm: query,
      status: "active"
    });

    return usersResult.users;
  } catch (error) {
    logger.error("Error searching users", { error: error.message });
    return [];
  }
}
