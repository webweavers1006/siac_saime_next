"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { personSchema } from "../schemas/person.schema";
import { savePersonAction } from "../actions/person.write.action";
import { getPersonFormConfig, getPersonDefaultValues } from "../config/person.form.config";

export function usePersonForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(personSchema),
    defaultValues: getPersonDefaultValues(item),
  });

  const formConfig = useMemo(() => getPersonFormConfig(), []);

  useEffect(() => {
    form.reset(getPersonDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await savePersonAction(data);

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
    onSubmit: form.handleSubmit(onSubmit),
  };
}
