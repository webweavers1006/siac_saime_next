"use client";

import { CASE_COMPLAINT_CONFIG } from "../config/case-complaint.constants";
import { formatDate } from "@/features/shared/lib/date-utils";

const { LABELS } = CASE_COMPLAINT_CONFIG.UI;

function yesNo(value) {
  return value ? "Sí" : "No";
}

/**
 * Read-only display of complaint data within a case detail view.
 * Only renders if complaint data is present.
 */
export function CaseComplaintInfo({ complaint }) {
  if (!complaint) return null;

  // Check if there's any meaningful data to show
  const hasData = Object.values(complaint).some(
    (v) => v !== null && v !== undefined && v !== "" && v !== false
  );
  if (!hasData) return null;

  const rows = [
    { label: LABELS.FORM.FIELDS.AFFECTS_PERSON, value: yesNo(complaint.affectsPerson) },
    { label: LABELS.FORM.FIELDS.AFFECTS_COMMUNITY, value: yesNo(complaint.affectsCommunity) },
    { label: LABELS.FORM.FIELDS.AFFECTS_THIRD_PARTIES, value: yesNo(complaint.affectsThirdParties) },
    { label: LABELS.FORM.FIELDS.INCIDENT_DATE, value: formatDate(complaint.incidentDate) },
    { label: LABELS.FORM.FIELDS.INVOLVED_PARTIES, value: complaint.involvedParties || "—" },
    { label: LABELS.FORM.FIELDS.POPULAR_INSTANCE, value: complaint.popularInstance || "—" },
    { label: LABELS.FORM.FIELDS.INSTANCE_RIF, value: complaint.instanceRif || "—" },
    { label: LABELS.FORM.FIELDS.FINANCING_ENTITY, value: complaint.financingEntity || "—" },
    { label: LABELS.FORM.FIELDS.PROJECT_NAME, value: complaint.projectName || "—" },
    { label: LABELS.FORM.FIELDS.APPROVED_AMOUNT, value: complaint.approvedAmount || "—" },
  ];

  return (
    <>
      <h2 className="text-lg font-semibold mb-4 mt-6 pt-4 border-t">Denuncia</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
            <span className="text-sm">{row.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}
