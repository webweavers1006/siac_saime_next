import { CASE_STATUS_CONFIG } from "./case-status.constants";

export const getCaseStatusFormConfig = () => {
  const { LABELS } = CASE_STATUS_CONFIG.UI;

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

export const getCaseStatusDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
