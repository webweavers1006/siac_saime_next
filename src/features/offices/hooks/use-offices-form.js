"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { officeSchema } from "../schemas/offices.schema";
import { saveOfficeAction } from "../actions/offices.write.action";
import { getOfficeFormConfig, getOfficeDefaultValues } from "../config/offices.form.config";

export function useOfficeForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(officeSchema),
    defaultValues: getOfficeDefaultValues(item),
  });

  const formConfig = useMemo(() => getOfficeFormConfig(), []);

  useEffect(() => {
    form.reset(getOfficeDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveOfficeAction(data);

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
