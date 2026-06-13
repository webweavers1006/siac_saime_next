import { logger } from "@/features/shared";
import { Suspense } from "react";
import { UserTable } from "@/features/users/components/UserTable";
import { TableSkeleton } from "@/components/shared/table/TableSkeleton";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { fetchUsersList } from "@/features/users/services/user.read.service";
import { USER_CONFIG } from "@/features/users";
import { RoleProvider } from "@/features/roles/components/RoleProvider";

const { LABELS } = USER_CONFIG.UI;

export async function UserPageContainer({ session, searchParams }) {
  let users, roles, totalCount, page, pageSize, totalPages;
  try {
    const params = (await searchParams) || {};
    const sortKey = params.sortKey || "name";
    const sortDirection = params.sortDirection || undefined;
    const searchTerm = params.q || "";
    const status = params.status || "all";
    page = params.page ? Number(params.page) : 1;
    pageSize = params.pageSize ? Number(params.pageSize) : USER_CONFIG.PAGINATION.DEFAULT_PAGE_SIZE;

    ({
      users,
      roles,
      totalCount,
      page,
      pageSize,
      totalPages,
    } = await fetchUsersList(session, {
      page,
      pageSize,
      searchTerm,
      status,
      sortKey,
      sortDirection,
    }));
  } catch (error) {
    logger.error("Error loading users data:", error);
    return (
      <ErrorAlert 
        title="Error"
        message={LABELS.MESSAGES.ERROR.LOAD}
      />
    );
  }

  return (
    <RoleProvider roles={roles}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{USER_CONFIG.TITLE}</h1>
          <p className="text-muted-foreground">
            {LABELS.DESCRIPTION}
          </p>
        </div>
        
        <Suspense fallback={<TableSkeleton />}>
          <UserTable 
            data={users} 
            pagination={{ page, pageSize, totalPages, totalCount }}
          />
        </Suspense>
      </div>
    </RoleProvider>
  );
}
