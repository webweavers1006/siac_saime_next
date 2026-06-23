import { OFFICE_CONFIG } from "./offices.constants";
import { getStatesForSelectAction } from "@/features/states/actions/state.select.action";

export const getOfficeFormConfig = () => {
  const { LABELS } = OFFICE_CONFIG.UI;

  return [
    [
      {
        name: "name",
        label: LABELS.FORM.FIELDS.NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.NAME,
        component: "input",
      },
      {
        name: "code",
        label: LABELS.FORM.FIELDS.CODE,
        placeholder: LABELS.FORM.PLACEHOLDERS.CODE,
        component: "input",
      },
    ],
    [
      {
        name: "address",
        label: LABELS.FORM.FIELDS.ADDRESS,
        placeholder: LABELS.FORM.PLACEHOLDERS.ADDRESS,
        component: "textarea",
      },
    ],
    [
      {
        name: "stateId",
        label: LABELS.FORM.FIELDS.STATE,
        component: "asyncSelect",
        placeholder: "Seleccionar estado...",
        loadOptions: getStatesForSelectAction,
        getOptionLabel: (item) => item.label,
        getOptionValue: (item) => item.value,
        emptyMessage: "No se encontraron estados.",
      },
    ],
    [
      {
        name: "chiefName",
        label: LABELS.FORM.FIELDS.CHIEF_NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.CHIEF_NAME,
        component: "input",
      },
      {
        name: "chiefIdCard",
        label: LABELS.FORM.FIELDS.CHIEF_ID_CARD,
        placeholder: LABELS.FORM.PLACEHOLDERS.CHIEF_ID_CARD,
        component: "input",
      },
    ],
    [
      {
        name: "chiefPhone",
        label: LABELS.FORM.FIELDS.CHIEF_PHONE,
        placeholder: LABELS.FORM.PLACEHOLDERS.CHIEF_PHONE,
        component: "input",
      },
      {
        name: "chiefEmail",
        label: LABELS.FORM.FIELDS.CHIEF_EMAIL,
        placeholder: LABELS.FORM.PLACEHOLDERS.CHIEF_EMAIL,
        component: "input",
        type: "email",
      },
    ],
    [
      {
        name: "observation",
        label: LABELS.FORM.FIELDS.OBSERVATION,
        component: "textarea",
      },
    ],
    [
      {
        name: "hasEmailChange",
        label: LABELS.FORM.FIELDS.HAS_EMAIL_CHANGE,
        component: "switch",
      },
      {
        name: "hasForeignAffairs",
        label: LABELS.FORM.FIELDS.HAS_FOREIGN_AFFAIRS,
        component: "switch",
      },
      {
        name: "hasMigration",
        label: LABELS.FORM.FIELDS.HAS_MIGRATION,
        component: "switch",
      },
      {
        name: "enableQrTicket",
        label: LABELS.FORM.FIELDS.ENABLE_QR_TICKET,
        component: "switch",
      },
      {
        name: "isActive",
        label: LABELS.FORM.FIELDS.IS_ACTIVE,
        component: "switch",
      },
    ],
  ];
};

export const getOfficeDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  code: item?.code || "",
  address: item?.address || "",
  stateId: item?.stateId || null,
  chiefName: item?.chiefName || "",
  chiefIdCard: item?.chiefIdCard || "",
  chiefPhone: item?.chiefPhone || "",
  chiefEmail: item?.chiefEmail || "",
  hasEmailChange: item?.hasEmailChange ?? false,
  hasForeignAffairs: item?.hasForeignAffairs ?? false,
  hasMigration: item?.hasMigration ?? false,
  enableQrTicket: item?.enableQrTicket ?? false,
  observation: item?.observation || "",
  isActive: item?.isActive ?? true,
});
