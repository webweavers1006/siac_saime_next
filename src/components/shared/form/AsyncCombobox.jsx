"use client"

import * as React from "react"
import { Loader2, ChevronsUpDown, Check } from "lucide-react"
import { cn } from "@/features/shared"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { logger } from "@/features/shared";

/**
 * AsyncCombobox
 * Implementación basada en Popover + Command (cmdk) para búsqueda asíncrona.
 * Sigue el patrón clásico de shadcn/ui utilizado en CustomMultiSelect.
 */
export function AsyncCombobox({
  value,
  onChange,
  fetcher,
  placeholder = "Seleccionar...",
  emptyMessage = "No se encontraron resultados.",
  getLabel = (item) => item?.name || item?.nombre || item?.label || "",
  getValue = (item) => String(item?.id || item?.value || ""),
  className,
  useFormControl = false
}) {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [selectedLabel, setSelectedLabel] = React.useState("")

  // Resolver label desde el valor inicial o cuando cambia
  React.useEffect(() => {
    const resolveLabel = async () => {
      if (!value) {
        setSelectedLabel("")
        setSearch("")
        return
      }

      const found = options.find(opt => getValue(opt) === String(value))
      if (found) {
        const label = getLabel(found)
        setSelectedLabel(label)
        setSearch(label)
        return
      }

      try {
        const initialResults = await fetcher("")
        if (initialResults) {
          setOptions(initialResults)
          const initialFound = initialResults.find(opt => getValue(opt) === String(value))
          if (initialFound) {
            const label = getLabel(initialFound)
            setSelectedLabel(label)
            setSearch(label)
          }
        }
      } catch (err) {
        logger.error("Error resolving initial label:", err)
      }
    }

    resolveLabel()
  }, [value, fetcher])

  // Carga de opciones filtradas (Debounced)
  React.useEffect(() => {
    if (!open) return

    if (search === selectedLabel && selectedLabel !== "") return

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const results = await fetcher(search)
        setOptions(results || [])
      } catch (err) {
        logger.error("Error fetching options:", err)
        setOptions([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, open, fetcher, selectedLabel])

  const handleSelect = React.useCallback((currentValue) => {
    const stringValue = currentValue ? String(currentValue) : ""
    onChange(stringValue)

    const found = options.find(opt => getValue(opt) === stringValue)
    if (found) {
      const label = getLabel(found)
      setSelectedLabel(label)
      setSearch(label)
    }

    setOpen(false)
  }, [onChange, options, getValue, getLabel])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 shadow-lg"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar..."
            value={search}
            onValueChange={setSearch}
            className="border-none focus:ring-0"
          />
          <CommandList>
            {loading && options.length === 0 ? (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
              </div>
            ) : options.length === 0 ? (
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandEmpty>
            ) : (
              <CommandGroup>
                {options.map((option) => {
                  const optValue = getValue(option)
                  const optLabel = getLabel(option)
                  const isSelected = String(value) === optValue
                  return (
                    <CommandItem
                      key={optValue}
                      value={optValue}
                      onSelect={handleSelect}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className="cursor-pointer pointer-events-auto data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 shrink-0",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {optLabel}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
