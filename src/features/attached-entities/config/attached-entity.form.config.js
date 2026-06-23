import { ATTACHED_ENTITY_CONFIG } from "./attached-entity.constants";

export const getAttachedEntityFormConfig = () => {
  const { LABELS } = ATTACHED_ENTITY_CONFIG.UI;

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

export const getAttachedEntityDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
