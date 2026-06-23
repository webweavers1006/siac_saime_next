"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { administrativeDirectionSchema } from "../schemas/administrative-direction.schema";
import { saveAdministrativeDirectionAction } from "../actions/administrative-direction.write.action";
import { getAdministrativeDirectionFormConfig, getAdministrativeDirectionDefaultValues } from "../config/administrative-direction.form.config";

export function useAdministrativeDirectionForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(administrativeDirectionSchema),
    defaultValues: getAdministrativeDirectionDefaultValues(item),
  });

  const formConfig = useMemo(() => getAdministrativeDirectionFormConfig(), []);

  useEffect(() => {
    form.reset(getAdministrativeDirectionDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveAdministrativeDirectionAction(data);

      if (result.success) {
        toast.success(result.message);
        onSuccess?.();
      } else {
        if (result.details) {
          Object.entries(result.details).forEach(([field, messages]) => {
            form.setError(field, { type: "server", message: messages[0] });
          });
        } else {
          toast.error(result.error || "Error al guardar");
        }
      }
    });
  };

  return {
    form,
    formConfig,
    isPending,
    onSubmit: form.handleSubmit(onSubmit)
  };
}
