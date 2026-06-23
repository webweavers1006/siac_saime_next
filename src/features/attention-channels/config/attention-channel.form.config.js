import { ATTENTION_CHANNEL_CONFIG } from "./attention-channel.constants";

export const getAttentionChannelFormConfig = () => {
  const { LABELS } = ATTENTION_CHANNEL_CONFIG.UI;

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

export const getAttentionChannelDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
