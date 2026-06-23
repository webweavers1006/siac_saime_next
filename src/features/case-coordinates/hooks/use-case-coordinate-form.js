import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { caseCoordinateSchema } from "@/features/case-coordinates/schemas/case-coordinate.schema";

/**
 * Hook for the case coordinate form.
 * Manages react-hook-form state with Zod validation.
 *
 * @param {object} [options]
 * @param {object} [options.defaultValues] - Initial form values
 */
export function useCaseCoordinateForm({ defaultValues } = {}) {
  const form = useForm({
    resolver: zodResolver(caseCoordinateSchema),
    defaultValues: {
      caseId: null,
      name: "",
      latitude: null,
      longitude: null,
      ...defaultValues,
    },
  });

  return form;
}
