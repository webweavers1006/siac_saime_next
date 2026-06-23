import { ATTENTION_TYPE_DETAIL_CONFIG } from "./attention-type-detail.constants";
import { getAttentionTypesForSelectAction } from "@/features/attention-types/actions/attention-type.select.action";

export const getAttentionTypeDetailFormConfig = () => {
  const { LABELS } = ATTENTION_TYPE_DETAIL_CONFIG.UI;

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
        name: "attentionTypeId",
        label: LABELS.FORM.FIELDS.ATTENTION_TYPE,
        placeholder: LABELS.FORM.PLACEHOLDERS.ATTENTION_TYPE,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getAttentionTypesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
  ];
};

export const getAttentionTypeDetailDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
  attentionTypeId: item?.attentionTypeId || undefined,
});
