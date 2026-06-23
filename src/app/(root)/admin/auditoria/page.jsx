import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { AuditLogPageContainer } from "@/features/audit-logs/components/AuditLogPageContainer";
import { AUDIT_LOG_CONFIG } from "@/features/audit-logs";

export const metadata = {
  title: `${AUDIT_LOG_CONFIG.TITLE} | Sistema`,
};

export default async function AuditLogPage({ searchParams }) {
  const { authorized } = await checkPageAccess(AUDIT_LOG_CONFIG.PERMISSIONS.VIEW);

  if (!authorized) {
    return <AccessDenied />;
  }

  return <AuditLogPageContainer searchParams={searchParams} />;
}
