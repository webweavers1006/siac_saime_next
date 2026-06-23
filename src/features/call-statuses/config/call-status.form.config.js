import { CALL_STATUS_CONFIG } from "./call-status.constants";

export const getCallStatusFormConfig = () => {
  const { LABELS } = CALL_STATUS_CONFIG.UI;

  return [
    [
      {
        name: "name",
        label: LABELS.FORM.FIELDS.NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.NAME,
        component: "input",
      },
    ],
  ];
};

export const getCallStatusDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
