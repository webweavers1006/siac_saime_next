"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useTransition, useEffect, useRef } from "react";
import { toast } from "sonner";
import { caseSchema } from "../schemas/case.schema";
import { saveCaseAction } from "../actions/case.write.action";
import { getCaseFormConfig, getCaseDefaultValues } from "../config/case.form.config";

export function useCaseForm({ defaultValues: item, operatorProfile, onSuccess }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(caseSchema),
    defaultValues: getCaseDefaultValues(item, operatorProfile),
  });

  // Form config is static — area filtering happens server-side via getOperatorAllowedAreasAction
  const formConfig = useMemo(() => getCaseFormConfig(), []);

  // Track previous reset fingerprint to avoid unnecessary form.reset()
  const prevResetKeyRef = useRef(null);
  const resetKey = JSON.stringify({
    itemId: item?.id ?? null,
    opId: operatorProfile?.attentionChannelId ?? null,
    areaId: operatorProfile?.defaultAreaId ?? null,
  });

  useEffect(() => {
    if (prevResetKeyRef.current !== resetKey) {
      prevResetKeyRef.current = resetKey;
      form.reset(getCaseDefaultValues(item, operatorProfile));
    }
  }, [resetKey, form]);

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await saveCaseAction(data);

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
