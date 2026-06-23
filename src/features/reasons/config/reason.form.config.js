import { REASON_CONFIG } from "./reason.constants";
import { getCaseAreasForSelectAction } from "@/features/case-areas/actions/case-area.select.action";

export const getReasonFormConfig = () => {
  const { LABELS } = REASON_CONFIG.UI;

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
        name: "caseAreaId",
        label: LABELS.FORM.FIELDS.CASE_AREA,
        placeholder: LABELS.FORM.PLACEHOLDERS.CASE_AREA,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getCaseAreasForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
  ];
};

export const getReasonDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  caseAreaId: item?.caseAreaId || undefined,
});
