import { PERSON_CONFIG } from "./person.constants";
import { getCountriesForSelectAction } from "@/features/countries/actions/country.select.action";
import { getStatesForSelectAction } from "@/features/states/actions/state.select.action";
import { getMunicipalitiesForSelectAction } from "@/features/municipalities/actions/municipality.select.action";
import { getParishesForSelectAction } from "@/features/parishes/actions/parish.select.action";
import { getBeneficiaryTypesForSelectAction } from "@/features/beneficiary-types/actions/beneficiary-type.select.action";

export const getPersonFormConfig = () => {
  const { LABELS } = PERSON_CONFIG.UI;

  return [
    // Section 1: Datos Personales
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.PERSONAL_DATA },
    ],
    [
      {
        name: "firstName",
        label: LABELS.FORM.FIELDS.FIRST_NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.FIRST_NAME,
        component: "input",
      },
      {
        name: "lastName",
        label: LABELS.FORM.FIELDS.LAST_NAME,
        placeholder: LABELS.FORM.PLACEHOLDERS.LAST_NAME,
        component: "input",
      },
    ],
    [
      {
        name: "idCard",
        label: LABELS.FORM.FIELDS.ID_CARD,
        placeholder: LABELS.FORM.PLACEHOLDERS.ID_CARD,
        component: "input",
      },
      {
        name: "phone",
        label: LABELS.FORM.FIELDS.PHONE,
        placeholder: LABELS.FORM.PLACEHOLDERS.PHONE,
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
        name: "address",
        label: LABELS.FORM.FIELDS.ADDRESS,
        placeholder: LABELS.FORM.PLACEHOLDERS.ADDRESS,
        component: "textarea",
        rows: 2,
      },
    ],

    // Section 2: Demográficos
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.DEMOGRAPHICS },
    ],
    [
      {
        name: "nationality",
        label: LABELS.FORM.FIELDS.NATIONALITY,
        placeholder: "Seleccionar...",
        component: "select",
        options: LABELS.FORM.NATIONALITY_OPTIONS,
      },
      {
        name: "sex",
        label: LABELS.FORM.FIELDS.SEX,
        placeholder: "Seleccionar...",
        component: "select",
        options: LABELS.FORM.SEX_OPTIONS,
      },
    ],
    [
      {
        name: "age",
        label: LABELS.FORM.FIELDS.AGE,
        placeholder: LABELS.FORM.PLACEHOLDERS.AGE,
        component: "input",
        type: "number",
      },
      {
        name: "birthDate",
        label: LABELS.FORM.FIELDS.BIRTH_DATE,
        placeholder: LABELS.FORM.PLACEHOLDERS.BIRTH_DATE,
        component: "input",
        type: "date",
      },
    ],
    [
      {
        name: "profession",
        label: LABELS.FORM.FIELDS.PROFESSION,
        placeholder: LABELS.FORM.PLACEHOLDERS.PROFESSION,
        component: "input",
      },
    ],

    // Section 3: Clasificación
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.CLASSIFICATION },
    ],
    [
      {
        name: "personType",
        label: LABELS.FORM.FIELDS.PERSON_TYPE,
        placeholder: "Seleccionar...",
        component: "select",
        options: LABELS.FORM.PERSON_TYPE_OPTIONS,
      },
      {
        name: "beneficiaryTypeId",
        label: LABELS.FORM.FIELDS.BENEFICIARY_TYPE,
        placeholder: LABELS.FORM.PLACEHOLDERS.BENEFICIARY_TYPE,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getBeneficiaryTypesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
    [
      {
        name: "legalInfo",
        label: LABELS.FORM.FIELDS.LEGAL_INFO,
        placeholder: LABELS.FORM.PLACEHOLDERS.LEGAL_INFO,
        component: "textarea",
        rows: 2,
      },
    ],

    // Section 4: Ubicación
    [
      { component: "sectionTitle", title: LABELS.FORM.SECTIONS.LOCATION },
    ],
    [
      {
        name: "countryId",
        label: LABELS.FORM.FIELDS.COUNTRY,
        placeholder: LABELS.FORM.PLACEHOLDERS.COUNTRY,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getCountriesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
      {
        name: "stateId",
        label: LABELS.FORM.FIELDS.STATE,
        placeholder: LABELS.FORM.PLACEHOLDERS.STATE,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getStatesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
    [
      {
        name: "municipalityId",
        label: LABELS.FORM.FIELDS.MUNICIPALITY,
        placeholder: LABELS.FORM.PLACEHOLDERS.MUNICIPALITY,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getMunicipalitiesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
      {
        name: "parishId",
        label: LABELS.FORM.FIELDS.PARISH,
        placeholder: LABELS.FORM.PLACEHOLDERS.PARISH,
        component: "asyncSelect",
        loadOptions: async (search) => {
          const result = await getParishesForSelectAction({ searchTerm: search });
          return result || [];
        },
        getOptionLabel: (opt) => opt.label,
        getOptionValue: (opt) => opt.value,
      },
    ],
  ];
};

export const getPersonDefaultValues = (item) => ({
  id: item?.id || undefined,
  firstName: item?.firstName || "",
  lastName: item?.lastName || "",
  idCard: item?.idCard || "",
  phone: item?.phone || "",
  email: item?.email || "",
  address: item?.address || "",
  nationality: item?.nationality || "",
  sex: item?.sex || "",
  age: item?.age ?? "",
  birthDate: item?.birthDate ? toDateInput(item.birthDate) : "",
  profession: item?.profession || "",
  personType: item?.personType || "",
  legalInfo: item?.legalInfo || "",
  countryId: item?.countryId || null,
  stateId: item?.stateId || null,
  municipalityId: item?.municipalityId || null,
  parishId: item?.parishId || null,
  beneficiaryTypeId: item?.beneficiaryTypeId || null,
});
