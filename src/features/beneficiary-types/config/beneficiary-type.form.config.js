import { BENEFICIARY_TYPE_CONFIG } from "./beneficiary-type.constants";

export const getBeneficiaryTypeFormConfig = () => {
  const { LABELS } = BENEFICIARY_TYPE_CONFIG.UI;

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
        name: "requiresIdCard",
        label: LABELS.FORM.FIELDS.REQUIRES_ID_CARD,
        component: "switch",
      },
    ],
  ];
};

export const getBeneficiaryTypeDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  requiresIdCard: item?.requiresIdCard !== undefined ? item.requiresIdCard : true,
});
