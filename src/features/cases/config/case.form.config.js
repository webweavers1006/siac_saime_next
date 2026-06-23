import { CASE_CONFIG } from "./case.constants";
import { getPersonsForSelectAction } from "@/features/persons/actions/person.select.action";
import { getCaseStatusesForSelectAction } from "@/features/case-statuses/actions/case-status.select.action";
import { getOperatorAllowedAreasAction } from "@/features/cases/actions/case.read.action";
import { getReasonsForSelectAction } from "@/features/reasons/actions/reason.select.action";
import { getAttentionTypesForSelectAction } from "@/features/attention-types/actions/attention-type.select.action";
import { getAttentionTypeDetailsForSelectAction } from "@/features/attention-type-details/actions/attention-type-detail.select.action";
import { getAttentionChannelsForSelectAction } from "@/features/attention-channels/actions/attention-channel.select.action";
import { getOfficesForSelectAction } from "@/features/offices/actions/offices.select.action";
import { getNowDefaults, toDateInput } from "@/features/shared/lib/date-utils";

export const getCaseFormConfig = () => {
  const { LABELS } = CASE_CONFIG.UI;

  return [
    // Section: Fecha y Hora — pre-llenados con el momento actual
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.CASE_DATE_TIME },
    ],
    [
      {
        name: "caseDate",
        label: LABELS.FORM.FIELDS.CASE_DATE,
        placeholder: LABELS.FORM.PLACEHOLDERS.CASE_DATE,
        component: "input",
        type: "date",
      },
      {
        name: "caseTime",
        label: LABELS.FORM.FIELDS.CASE_TIME,
        placeholder: LABELS.FORM.PLACEHOLDERS.CASE_TIME,
        component: "input",
        type: "time",
      },
    ],

    // Section: Solicitante (el operador se asigna automáticamente desde la sesión)
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.APPLICANT },
    ],
    [
      {
        name: "personId",
        label: LABELS.FORM.FIELDS.PERSON,
        placeholder: LABELS.FORM.PLACEHOLDERS.PERSON,
        component: "asyncSelect",
        loadOptions: async (search) => getPersonsForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
        renderOption: (opt) => (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {opt.firstName} {opt.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {opt.idCard || "S/C"}
            </span>
          </div>
        ),
      },
    ],

    // Section: Clasificación — define qué campos extra mostrar
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.CLASSIFICATION },
    ],
    [
      {
        name: "attentionTypeId",
        label: LABELS.FORM.FIELDS.ATTENTION_TYPE,
        placeholder: LABELS.FORM.PLACEHOLDERS.ATTENTION_TYPE,
        component: "asyncSelect",
        loadOptions: async (search) => getAttentionTypesForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
      {
        name: "caseAreaId",
        label: LABELS.FORM.FIELDS.CASE_AREA,
        placeholder: LABELS.FORM.PLACEHOLDERS.CASE_AREA,
        component: "asyncSelect",
        loadOptions: async (search) => getOperatorAllowedAreasAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
    [
      {
        name: "reasonId",
        label: LABELS.FORM.FIELDS.REASON,
        placeholder: LABELS.FORM.PLACEHOLDERS.REASON,
        component: "asyncSelect",
        loadOptions: async (search, caseAreaId) => getReasonsForSelectAction({ searchTerm: search, caseAreaId }),
        dependsOn: "caseAreaId",
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
      {
        name: "caseStatusId",
        label: LABELS.FORM.FIELDS.CASE_STATUS,
        placeholder: LABELS.FORM.PLACEHOLDERS.CASE_STATUS,
        component: "asyncSelect",
        loadOptions: async (search) => getCaseStatusesForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
    [
      {
        name: "attentionTypeDetailId",
        label: LABELS.FORM.FIELDS.ATTENTION_TYPE_DETAIL,
        placeholder: LABELS.FORM.PLACEHOLDERS.ATTENTION_TYPE_DETAIL,
        component: "asyncSelect",
        loadOptions: async (search) => getAttentionTypeDetailsForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
        showWhen: (flags) => flags?.hasAttentionDetail,
      },
      {
        name: "attentionChannelId",
        label: LABELS.FORM.FIELDS.ATTENTION_CHANNEL,
        placeholder: LABELS.FORM.PLACEHOLDERS.ATTENTION_CHANNEL,
        component: "asyncSelect",
        loadOptions: async (search) => getAttentionChannelsForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],

    // Section: Descripción
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.CASE_DETAILS },
    ],
    [
      {
        name: "description",
        label: LABELS.FORM.FIELDS.DESCRIPTION,
        placeholder: LABELS.FORM.PLACEHOLDERS.DESCRIPTION,
        component: "textarea",
        rows: 4,
      },
    ],

    // Section: Entes y Oficinas
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.ENTITIES_OFFICES },
    ],
    [
      {
        name: "officeId",
        label: LABELS.FORM.FIELDS.OFFICE,
        placeholder: LABELS.FORM.PLACEHOLDERS.OFFICE,
        component: "asyncSelect",
        loadOptions: async (search) => getOfficesForSelectAction({ searchTerm: search }),
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],

    // Section: Denuncia — solo visible si el tipo de atención tiene hasComplaint=true
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.COMPLAINT, showWhen: (flags) => flags?.hasComplaint },
    ],
    [
      {
        name: "complaint.affectsPerson",
        label: LABELS.FORM.FIELDS.COMPLAINT_AFFECTS_PERSON,
        component: "checkbox",
        showWhen: (flags) => flags?.hasComplaint,
      },
      {
        name: "complaint.affectsCommunity",
        label: LABELS.FORM.FIELDS.COMPLAINT_AFFECTS_COMMUNITY,
        component: "checkbox",
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],
    [
      {
        name: "complaint.affectsThirdParties",
        label: LABELS.FORM.FIELDS.COMPLAINT_AFFECTS_THIRD_PARTIES,
        component: "checkbox",
        showWhen: (flags) => flags?.hasComplaint,
      },
      {
        name: "complaint.incidentDate",
        label: LABELS.FORM.FIELDS.COMPLAINT_INCIDENT_DATE,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_INCIDENT_DATE,
        component: "input",
        type: "date",
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],
    [
      {
        name: "complaint.involvedParties",
        label: LABELS.FORM.FIELDS.COMPLAINT_INVOLVED_PARTIES,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_INVOLVED_PARTIES,
        component: "textarea",
        rows: 2,
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],
    [
      {
        name: "complaint.popularInstance",
        label: LABELS.FORM.FIELDS.COMPLAINT_POPULAR_INSTANCE,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_POPULAR_INSTANCE,
        component: "input",
        showWhen: (flags) => flags?.hasComplaint,
      },
      {
        name: "complaint.instanceRif",
        label: LABELS.FORM.FIELDS.COMPLAINT_INSTANCE_RIF,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_INSTANCE_RIF,
        component: "input",
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],
    [
      {
        name: "complaint.financingEntity",
        label: LABELS.FORM.FIELDS.COMPLAINT_FINANCING_ENTITY,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_FINANCING_ENTITY,
        component: "input",
        showWhen: (flags) => flags?.hasComplaint,
      },
      {
        name: "complaint.projectName",
        label: LABELS.FORM.FIELDS.COMPLAINT_PROJECT_NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_PROJECT_NAME,
        component: "input",
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],
    [
      {
        name: "complaint.approvedAmount",
        label: LABELS.FORM.FIELDS.COMPLAINT_APPROVED_AMOUNT,
        placeholder: LABELS.FORM.PLACEHOLDERS.COMPLAINT_APPROVED_AMOUNT,
        component: "input",
        showWhen: (flags) => flags?.hasComplaint,
      },
    ],

  ];
};

export const getCaseDefaultValues = (item, operatorProfile) => {
  const now = getNowDefaults();

  return {
    id: item?.id || undefined,
    caseDate: item?.caseDate ? toDateInput(item.caseDate) : now.date,
    caseTime: item?.caseTime || now.time,
    personId: item?.personId || null,
    caseStatusId: item?.caseStatusId || null,
    caseAreaId: item?.caseAreaId ?? operatorProfile?.defaultAreaId ?? null,
    reasonId: item?.reasonId || null,
    attentionTypeId: item?.attentionTypeId || null,
    attentionTypeDetailId: item?.attentionTypeDetailId || null,
    description: item?.description || "",
    attentionChannelId: item?.attentionChannelId ?? operatorProfile?.attentionChannelId ?? null,
    officeId: item?.officeId || null,
    complaint: {
      affectsPerson: item?.complaint?.affectsPerson ?? false,
      affectsCommunity: item?.complaint?.affectsCommunity ?? false,
      affectsThirdParties: item?.complaint?.affectsThirdParties ?? false,
      involvedParties: item?.complaint?.involvedParties || "",
      incidentDate: item?.complaint?.incidentDate || "",
      popularInstance: item?.complaint?.popularInstance || "",
      instanceRif: item?.complaint?.instanceRif || "",
      financingEntity: item?.complaint?.financingEntity || "",
      projectName: item?.complaint?.projectName || "",
      approvedAmount: item?.complaint?.approvedAmount || "",
    },
  };
};
