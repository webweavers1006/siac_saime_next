"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/features/shared"
import { logger } from "@/features/shared"
import { SHARED_CONFIG } from "@/features/shared"

const FILE_UPLOAD_LABELS = SHARED_CONFIG.UI.LABELS.FILE_UPLOAD;

const STATUS = {
  IDLE: "idle",
  SELECTED: "selected",
  UPLOADING: "uploading",
  SUCCESS: "success",
  ERROR: "error",
}

/**
 * Generic File Upload component with drag & drop, progress, and preview.
 *
 * @param {Object} props
 * @param {Function} props.onUpload - Async function (file) => Promise<string> that returns the URL.
 * @param {Object} props.fileConfig - Feature-specific config: { maxSize, accept, magicBytes }.
 * @param {string} props.currentUrl - Optional existing URL to show as already uploaded.
 * @param {string} props.label - Label for the upload area.
 * @param {string} props.description - Description shown in the drop zone.
 * @param {Function} props.onChange - Optional callback with the resulting URL.
 * @param {Object} props.labels - Optional custom labels. Overrides defaults.
 */
export function FileUpload({
  onUpload,
  fileConfig,
  currentUrl,
  label,
  description,
  onChange,
  labels: customLabels,
  mode = "instant",
  onFileSelect,
  onFileRemove,
  deferredFileName,
}) {
  const inputRef = useRef(null)
  const hasDeferredFile = mode === "deferred" && deferredFileName
  const [status, setStatus] = useState(
    currentUrl || hasDeferredFile ? STATUS.SUCCESS : STATUS.IDLE
  )
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || "")
  const [fileName, setFileName] = useState(hasDeferredFile ? deferredFileName : "")
  const [errorMsg, setErrorMsg] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const allowedExtensions = useMemo(() => fileConfig?.accept || [], [fileConfig])

  const labels = useMemo(() => ({
    noFile: FILE_UPLOAD_LABELS.NO_FILE,
    invalidExtension: FILE_UPLOAD_LABELS.INVALID_EXTENSION(allowedExtensions.join(", ").toUpperCase()),
    invalidContent: FILE_UPLOAD_LABELS.INVALID_CONTENT,
    verifyFailed: FILE_UPLOAD_LABELS.VERIFY_FAILED,
    uploading: FILE_UPLOAD_LABELS.UPLOADING,
    error: FILE_UPLOAD_LABELS.ERROR,
    retry: FILE_UPLOAD_LABELS.RETRY,
    success: mode === "deferred" ? FILE_UPLOAD_LABELS.SUCCESS_DEFERRED : FILE_UPLOAD_LABELS.SUCCESS_INSTANT,
    uploadError: FILE_UPLOAD_LABELS.UPLOAD_ERROR,
    dragPrompt: FILE_UPLOAD_LABELS.DRAG_PROMPT,
    dropPrompt: FILE_UPLOAD_LABELS.DROP_PROMPT,
    ...customLabels,
  }), [allowedExtensions, customLabels, mode])

  const validateFile = useCallback(async (file) => {
    if (!file) return labels.noFile

    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
      return labels.invalidExtension
    }

    const maxSize = fileConfig?.maxSize || 5 * 1024 * 1024
    if (file.size > maxSize) {
      const mb = (maxSize / 1024 / 1024).toFixed(0)
      return FILE_UPLOAD_LABELS.MAX_SIZE(mb)
    }

    if (fileConfig?.magicBytes) {
      try {
        const buffer = await file.arrayBuffer()
        const header = new Uint8Array(buffer.slice(0, 4))
        const ext2 = file.name.split(".").pop()?.toLowerCase()
        const expected = fileConfig.magicBytes[ext2]

        if (expected) {
          const match = expected.every((byte, i) => header[i] === byte)
          if (!match) return labels.invalidContent
        }
      } catch {
        return labels.verifyFailed
      }
    }

    return null
  }, [allowedExtensions, fileConfig, labels])

  const handleFile = useCallback(async (file) => {
    const validationError = await validateFile(file)
    if (validationError) {
      setStatus(STATUS.ERROR)
      setErrorMsg(validationError)
      return
    }

    setFileName(file.name)
    setStatus(STATUS.SELECTED)

    if (mode === "deferred") {
      setStatus(STATUS.SUCCESS)
      onFileSelect?.(file)
      return
    }

    if (!onUpload) {
      logger.warn("FileUpload: No onUpload handler provided.")
      return
    }

    setStatus(STATUS.UPLOADING)
    setErrorMsg("")

    try {
      const url = await onUpload(file)
      setUploadedUrl(url)
      setStatus(STATUS.SUCCESS)
      onChange?.(url)
    } catch (err) {
      logger.error("FileUpload upload failed:", err)
      setStatus(STATUS.ERROR)
      setErrorMsg(err.message || labels.uploadError)
    }
  }, [validateFile, onUpload, onChange, labels, mode, onFileSelect])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInputChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleRemove = useCallback(() => {
    if (mode === "deferred") {
      onFileRemove?.()
    }
    setStatus(STATUS.IDLE)
    setUploadedUrl("")
    setFileName("")
    setErrorMsg("")
    onChange?.("")
    if (inputRef.current) inputRef.current.value = ""
  }, [onChange, mode, onFileRemove])

  if (status === STATUS.SUCCESS && (uploadedUrl || (mode === "deferred" && fileName))) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/10 p-4">
        <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-success truncate">
            {labels.success}
          </p>
          {fileName && (
            <p className="text-xs text-success/70 truncate">{fileName}</p>
          )}
        </div>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-success hover:text-destructive" onClick={handleRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click() }}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 border-dashed p-6 flex flex-col items-center justify-center gap-2 transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/30",
          status === STATUS.ERROR && "border-destructive/50 bg-destructive/5",
          status === STATUS.UPLOADING && "pointer-events-none opacity-70"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={allowedExtensions.join(",")}
          className="hidden"
          onChange={handleInputChange}
          disabled={status === STATUS.UPLOADING}
        />

        {status === STATUS.UPLOADING ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{labels.uploading}</p>
          </>
        ) : status === STATUS.ERROR ? (
          <>
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm font-medium text-destructive">{labels.error}</p>
            <p className="text-xs text-destructive/80 text-center max-w-xs">{errorMsg}</p>
            <Button type="button" variant="ghost" size="sm" className="mt-1">
              {labels.retry}
            </Button>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium">
                {isDragOver ? labels.dropPrompt : labels.dragPrompt}
              </p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              <p className="text-[10px] text-muted-foreground/60">
                {allowedExtensions.join(", ").toUpperCase()} — Máx. {(fileConfig?.maxSize || 5 * 1024 * 1024) / 1024 / 1024}MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
