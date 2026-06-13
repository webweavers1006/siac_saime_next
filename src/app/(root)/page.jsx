import { Suspense } from "react";
import { checkPageAccess } from "@/features/auth/lib/auth-guard";
import { AccessDenied } from "@/components/shared/AccessDenied";
import { SITE_CONFIG } from "@/features/shared";
import { DASHBOARD_CONFIG } from "@/features/shared";

const { UI: { LABELS }, METADATA } = DASHBOARD_CONFIG;

export const metadata = {
  title: `Dashboard | ${SITE_CONFIG.name}`,
  description: METADATA.DESCRIPTION,
};

export default async function DashboardPage() {
  const { authorized, session } = await checkPageAccess();

  if (!authorized) {
    return <AccessDenied />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{LABELS.TITLE}</h1>
        <p className="text-muted-foreground">
          {LABELS.LOGGED_IN_AS} <strong>{session.role}</strong>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">{LABELS.SYSTEM_STATUS}</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-success">{LABELS.ONLINE}</div>
            <p className="text-xs text-muted-foreground mt-1">{LABELS.DB_CONNECTION}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
