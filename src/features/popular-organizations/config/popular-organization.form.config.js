import { POPULAR_ORGANIZATION_CONFIG } from "./popular-organization.constants";

export const getPopularOrganizationFormConfig = () => {
  const { LABELS } = POPULAR_ORGANIZATION_CONFIG.UI;

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

export const getPopularOrganizationDefaultValues = (item) => ({
  id: item?.id || undefined,
  name: item?.name || "",
});
