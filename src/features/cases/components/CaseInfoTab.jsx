"use client";

import { CASE_CONFIG } from "../config/case.constants";
import { formatDate } from "@/features/shared/lib/date-utils";
import { CaseComplaintInfo } from "@/features/case-complaints/components/CaseComplaintInfo";

const { LABELS } = CASE_CONFIG.UI;

/**
 * Read-only display of case information.
 */
export function CaseInfoTab({ caseData }) {
  const rows = [
    { label: LABELS.TABLE.REQUEST_NUMBER, value: caseData.requestNumber },
    { label: LABELS.FORM.FIELDS.CASE_DATE, value: formatDate(caseData.caseDate) },
    { label: LABELS.FORM.FIELDS.CASE_TIME, value: caseData.caseTime || "—" },
    { label: LABELS.TABLE.PERSON, value: caseData.personName || "—" },
    { label: LABELS.TABLE.CASE_STATUS, value: caseData.caseStatusName || "—" },
    { label: LABELS.TABLE.CASE_AREA, value: caseData.caseAreaName || "—" },
    { label: LABELS.TABLE.REASON, value: caseData.reasonName || "—" },
    { label: LABELS.TABLE.ATTENTION_TYPE, value: caseData.attentionTypeName || "—" },
    { label: LABELS.TABLE.ATTENTION_CHANNEL, value: caseData.attentionChannelName || "—" },
    { label: LABELS.FORM.FIELDS.ATTACHED_ENTITY, value: caseData.attachedEntityName || "—" },
    { label: LABELS.FORM.FIELDS.POPULAR_ORGANIZATION, value: caseData.popularOrganizationName || "—" },
    { label: LABELS.FORM.FIELDS.OFFICE, value: caseData.officeName || "—" },
  ];

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">{LABELS.FORM.SECTIONS.CASE_DETAILS}</h2>

        {caseData.description && (
          <div className="mb-4 p-3 rounded-md bg-muted/50">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{caseData.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
              <span className="text-sm">{row.value}</span>
            </div>
          ))}
        </div>

        <CaseComplaintInfo complaint={caseData.complaint} />
      </div>
    </div>
  );
}
