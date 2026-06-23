import { CASE_AREA_CONFIG } from "./case-area.constants";

export const getCaseAreaFormConfig = () => {
  const { LABELS } = CASE_AREA_CONFIG.UI;

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

export const getCaseAreaDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
