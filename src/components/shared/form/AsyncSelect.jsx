"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react"

import { cn } from "@/features/shared"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { logger } from "@/features/shared"

const DEBOUNCE_MS = 300

/**
 * Async search-select dropdown. Fetches options from a server action.
 *
 * Key behaviors:
 * - First open → immediate fetch (no double-fetch flicker).
 * - User types  → debounced fetch; overlay hides stale options instantly.
 * - Closes      → resets search so next open starts fresh.
 * - Edit mode   → loads options on mount when value is pre-set.
 */
export function AsyncSelect({
  value,
  onChange,
  fetcher,
  renderOption,
  getLabel = (opt) => opt.label || opt.nombre,
  getValue = (opt) => opt.value || opt.id,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados.",
  initialData = null,
  useFormControl = true,
  triggerClassName,
  fetchOnOpen = true,
  onOptionsLoad,
}) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState(initialData ? [initialData] : [])
  const [loading, setLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  // ---- Refs ----
  const mountedRef = React.useRef(true)
  const reqIdRef = React.useRef(0)
  // Single ref object for callback props — avoids N individual sync effects
  const cbRef = React.useRef({ fetcher, getValue, getLabel, onOptionsLoad })
  // Track previous render values to detect transitions
  const prevOpenRef = React.useRef(false)
  const prevSearchRef = React.useRef("")
  // Last query actually sent to the server — lets us know if current searchTerm is stale
  const lastQueryRef = React.useRef("")
  // One-shot initial load guard (value pre-set at mount, e.g. edit mode)
  const didInitRef = React.useRef(false)

  // Lifecycle
  React.useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Sync all callback props in a single effect
  React.useEffect(() => {
    cbRef.current = { fetcher, getValue, getLabel, onOptionsLoad }
  }, [fetcher, getValue, getLabel, onOptionsLoad])

  // ---- Derived selected option (sync — no extra render frame) ----
  const selectedOption = React.useMemo(() => {
    if (!value || options.length === 0) return initialData ?? null
    const found = options.find(
      (opt) => String(cbRef.current.getValue(opt)) === String(value)
    )
    return found ?? initialData ?? null
  }, [value, options, initialData])

  // ---- Fetch (requestId guards against stale async responses) ----
  const loadOptions = React.useCallback(async (query = "") => {
    const id = ++reqIdRef.current
    lastQueryRef.current = query
    setLoading(true)
    try {
      const results = await cbRef.current.fetcher(query)
      if (mountedRef.current && reqIdRef.current === id) {
        setOptions(results || [])
        cbRef.current.onOptionsLoad?.(results || [])
      }
    } catch (error) {
      logger.error("AsyncSelect error:", error)
      if (mountedRef.current && reqIdRef.current === id) setOptions([])
    } finally {
      if (mountedRef.current && reqIdRef.current === id) setLoading(false)
    }
  }, [])

  // ---- Initial load when value is pre-set (edit mode) ----
  React.useEffect(() => {
    if (value && !didInitRef.current) {
      didInitRef.current = true
      loadOptions("")
    }
  }, [value, loadOptions])

  // ---- Unified open / search effect ----
  // On first open → fetch immediately (no debounce).
  // On user type → debounce 300ms, overlay covers stale options instantly.
  React.useEffect(() => {
    const justOpened = open && !prevOpenRef.current
    const searchChanged = searchTerm !== prevSearchRef.current
    prevOpenRef.current = open
    prevSearchRef.current = searchTerm

    if (!open) return

    if (justOpened) {
      if (options.length === 0 && fetchOnOpen) loadOptions("")
      return
    }

    if (searchChanged) {
      const timer = setTimeout(() => loadOptions(searchTerm), DEBOUNCE_MS)
      return () => clearTimeout(timer)
    }
  }, [open, searchTerm, options.length, fetchOnOpen, loadOptions])

  // ---- Open / close handler — resets search state on close ----
  const handleOpenChange = React.useCallback((next) => {
    if (!next) {
      setSearchTerm("")
      prevSearchRef.current = ""
      lastQueryRef.current = ""
    }
    setOpen(next)
  }, [])

  // ---- Clear search — resets to initial options immediately (no debounce) ----
  const handleClear = React.useCallback(() => {
    setSearchTerm("")
    prevSearchRef.current = ""
    lastQueryRef.current = ""
    loadOptions("")
  }, [loadOptions])

  // ---- Derived UI state ----
  const displayLabel = selectedOption ? cbRef.current.getLabel(selectedOption) : null
  // Show overlay when: fetching, OR user typed something not yet served to the server
  const showOverlay =
    loading || (open && searchTerm !== "" && searchTerm !== lastQueryRef.current)

  // ---- Render ----
  const Trigger = (
    <Button
      variant="outline"
      role="combobox"
      type="button"
      className={cn(
        "w-full min-w-0 justify-between overflow-hidden",
        !value && "text-muted-foreground",
        triggerClassName
      )}
    >
      <span className="truncate min-w-0 flex-1">
        {displayLabel
          ?? (value && loading ? "Cargando…" : null)
          ?? placeholder}
      </span>
      <span className="ml-2 flex items-center gap-1 shrink-0">
        {value && (
          <span
            role="button"
            tabIndex={0}
            className="rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer inline-flex items-center justify-center"
            aria-label="Limpiar selección"
            onClick={(e) => {
              e.stopPropagation()
              onChange("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.stopPropagation()
                onChange("")
              }
            }}
          >
            <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
          </span>
        )}
        <span className="w-4 flex justify-center">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          )}
        </span>
      </span>
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {useFormControl ? <FormControl>{Trigger}</FormControl> : Trigger}
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden p-0 isolate"
        align="start"
      >
        {/* Search input */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 placeholder:text-muted-foreground"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 ml-1"
              onClick={handleClear}
              type="button"
              aria-label="Limpiar búsqueda"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Options list — overlay on top covers stale results during search */}
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px] relative">
            {!showOverlay && options.length === 0 && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((option) => {
                const optValue = cbRef.current.getValue(option)
                const isSelected = String(value) === String(optValue)
                return (
                  <CommandItem
                    key={optValue}
                    value={String(optValue)}
                    onMouseDown={(e) => e.preventDefault()}
                    onSelect={() => {
                      onChange(isSelected ? "" : optValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {renderOption ? (
                      renderOption(option)
                    ) : (
                      <span className="truncate min-w-0 flex-1 [overflow-wrap:anywhere]">
                        {cbRef.current.getLabel(option)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {/* Overlay — covers stale options while fetching or waiting for debounce */}
            {showOverlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-md">
                <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground font-medium">
                  Buscando…
                </span>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
