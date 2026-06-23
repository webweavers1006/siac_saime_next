"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useCaseCoordinateForm } from "@/features/case-coordinates/hooks/use-case-coordinate-form";
import { saveCaseCoordinateAction } from "@/features/case-coordinates/actions/case-coordinate.write.action";
import { getCaseCoordinateByCaseIdAction } from "@/features/case-coordinates/actions/case-coordinate.read.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CASE_COORDINATE_CONFIG } from "@/features/case-coordinates/config/case-coordinate.constants";

const { LABELS } = CASE_COORDINATE_CONFIG.UI;

/**
 * Form to add or edit coordinates for a specific case.
 *
 * @param {object} props
 * @param {number} props.caseId - The case to attach coordinates to
 * @param {function} [props.onSuccess] - Callback after successful save
 */
export function CaseCoordinateForm({ caseId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [existingId, setExistingId] = useState(null);

  const form = useCaseCoordinateForm({
    defaultValues: { caseId },
  });

  const { register, handleSubmit, reset, formState: { errors } } = form;

  // Load existing coordinate for this case
  useEffect(() => {
    if (!caseId) return;
    async function loadExisting() {
      try {
        const existing = await getCaseCoordinateByCaseIdAction(caseId);
        if (existing) {
          setExistingId(existing.id);
          reset({
            caseId,
            id: existing.id,
            name: existing.name || "",
            latitude: existing.latitude,
            longitude: existing.longitude,
          });
        }
      } catch {
        // non-blocking
      }
    }
    loadExisting();
  }, [caseId, reset]);

  const onSubmit = useCallback(async (data) => {
    setLoading(true);
    try {
      const result = await saveCaseCoordinateAction(data);
      if (result.success) {
        toast.success(result.message || LABELS.MESSAGES.SUCCESS.CREATE);
        if (result.data) {
          setExistingId(result.data.id);
          reset({
            caseId,
            id: result.data.id,
            name: result.data.name || "",
            latitude: result.data.latitude,
            longitude: result.data.longitude,
          });
        }
        onSuccess?.();
      } else {
        toast.error(result.error || LABELS.MESSAGES.ERROR.CREATE);
      }
    } catch {
      toast.error(LABELS.MESSAGES.ERROR.CREATE);
    } finally {
      setLoading(false);
    }
  }, [caseId, reset, onSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("caseId")} />
      {existingId && <input type="hidden" {...register("id")} />}

      <div className="space-y-2">
        <Label htmlFor="coord-name">{LABELS.FORM.FIELDS.NAME}</Label>
        <Input
          id="coord-name"
          placeholder={LABELS.FORM.PLACEHOLDERS.NAME}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="coord-lat">{LABELS.FORM.FIELDS.LATITUDE}</Label>
          <Input
            id="coord-lat"
            type="number"
            step="any"
            placeholder={LABELS.FORM.PLACEHOLDERS.LATITUDE}
            {...register("latitude", { valueAsNumber: true })}
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">{errors.latitude.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="coord-lng">{LABELS.FORM.FIELDS.LONGITUDE}</Label>
          <Input
            id="coord-lng"
            type="number"
            step="any"
            placeholder={LABELS.FORM.PLACEHOLDERS.LONGITUDE}
            {...register("longitude", { valueAsNumber: true })}
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? LABELS.FORM.SAVING : existingId ? LABELS.FORM.UPDATE : LABELS.FORM.SUBMIT}
      </Button>
    </form>
  );
}
