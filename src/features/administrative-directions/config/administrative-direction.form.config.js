import { ADMINISTRATIVE_DIRECTION_CONFIG } from "./administrative-direction.constants";

export const getAdministrativeDirectionFormConfig = () => {
  const { LABELS } = ADMINISTRATIVE_DIRECTION_CONFIG.UI;

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
        name: "email",
        label: LABELS.FORM.FIELDS.EMAIL,
        placeholder: LABELS.FORM.PLACEHOLDERS.EMAIL,
        component: "input",
        type: "email",
      },
    ],
    [
      {
        name: "isAudit",
        label: LABELS.FORM.FIELDS.IS_AUDIT,
        component: "switch",
      },
    ],
  ];
};

export const getAdministrativeDirectionDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  email: item?.email || "",
  isAudit: item?.isAudit ?? false,
});
