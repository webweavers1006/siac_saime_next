import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { UserPageContainer } from "@/features/users/components/UserPageContainer";
import { USER_CONFIG } from "@/features/users";

const { LABELS } = USER_CONFIG.UI;

export const metadata = {
  title: `${USER_CONFIG.TITLE} | Sistema`,
  description: LABELS.DESCRIPTION,
};

export default async function UsersPage({ searchParams }) {
  const { authorized, session } = await checkPageAccess(USER_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <UserPageContainer session={session} searchParams={searchParams} />;
}
