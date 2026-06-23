"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect } from "react";
import { toast } from "sonner";
import { attachedEntitySchema } from "../schemas/attached-entity.schema";
import { saveAttachedEntityAction } from "../actions/attached-entity.write.action";
import { getAttachedEntityFormConfig, getAttachedEntityDefaultValues } from "../config/attached-entity.form.config";

export function useAttachedEntityForm({ defaultValues: item, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(attachedEntitySchema),
    defaultValues: getAttachedEntityDefaultValues(item),
  });

  const formConfig = useMemo(() => getAttachedEntityFormConfig(), []);

  useEffect(() => {
    form.reset(getAttachedEntityDefaultValues(item));
  }, [item, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveAttachedEntityAction(data);

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
