import { ATTENTION_TYPE_CONFIG } from "./attention-type.constants";

export const getAttentionTypeFormConfig = () => {
  const { LABELS } = ATTENTION_TYPE_CONFIG.UI;

  return [
    [
      {
        name: "name",
        label: LABELS.FORM.FIELDS.NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.NAME,
        component: "input",
      },
    ],
    [
      {
        name: "showCaseArea",
        label: LABELS.FORM.FIELDS.SHOW_CASE_AREA,
        component: "switch",
      },
      {
        name: "showParticipants",
        label: LABELS.FORM.FIELDS.SHOW_PARTICIPANTS,
        component: "switch",
      },
    ],
    [
      {
        name: "sendEmail",
        label: LABELS.FORM.FIELDS.SEND_EMAIL,
        component: "switch",
      },
      {
        name: "showPopularOrg",
        label: LABELS.FORM.FIELDS.SHOW_POPULAR_ORG,
        component: "switch",
      },
    ],
    [
      {
        name: "showCoordinates",
        label: LABELS.FORM.FIELDS.SHOW_COORDINATES,
        component: "switch",
      },
      {
        name: "showDocuments",
        label: LABELS.FORM.FIELDS.SHOW_DOCUMENTS,
        component: "switch",
      },
    ],
    [
      {
        name: "showPuntoCuenta",
        label: LABELS.FORM.FIELDS.SHOW_PUNTO_CUENTA,
        component: "switch",
      },
    ],
  ];
};

export const getAttentionTypeDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  showCaseArea: item?.showCaseArea ?? false,
  showParticipants: item?.showParticipants ?? false,
  sendEmail: item?.sendEmail ?? false,
  showPopularOrg: item?.showPopularOrg ?? false,
  showCoordinates: item?.showCoordinates ?? false,
  showDocuments: item?.showDocuments ?? false,
  showPuntoCuenta: item?.showPuntoCuenta ?? false,
});
