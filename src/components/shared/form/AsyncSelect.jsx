"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"

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
import { logger } from "@/features/shared";

/**
 * Componente de Selección Asíncrona Robusto.
 * Evita el filtrado interno de cmdk usando un input estándar.
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
  fetchOnOpen = true
}) {
  const [open, setOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState(initialData)
  const [options, setOptions] = React.useState(initialData ? [initialData] : [])
  const [loading, setLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  
  const isMountedRef = React.useRef(true)
  React.useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  // Sincronizar label si cambia el valor externo
  React.useEffect(() => {
    if (value && options.length > 0) {
      const found = options.find(opt => String(getValue(opt)) === String(value))
      if (found) setSelectedOption(found)
    } else if (!value) {
      setSelectedOption(null)
    }
  }, [value, options, getValue])

  // Carga de datos
  const loadOptions = React.useCallback(async (query = "") => {
    setLoading(true)
    try {
      const results = await fetcher(query)
      if (isMountedRef.current) {
        setOptions(results || [])
      }
    } catch (error) {
      logger.error("AsyncSelect error:", error)
      if (isMountedRef.current) setOptions([])
    } finally {
      if (isMountedRef.current) setLoading(false)
    }
  }, [fetcher])

  // Carga inicial al montar si hay valor, o al abrir
  React.useEffect(() => {
    if ((value && options.length === 0) || (open && options.length === 0)) {
      loadOptions("")
    }
  }, [value, open, options.length, loadOptions])

  // Debounce manual para la búsqueda
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (open) loadOptions(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm, open, loadOptions])

  const displayLabel = selectedOption ? getLabel(selectedOption) : null

  const Trigger = (
    <Button
      variant="outline"
      role="combobox"
      type="button"
      className={cn("w-full justify-between", !value && "text-muted-foreground", triggerClassName)}
    >
      <span className="truncate">{displayLabel || placeholder}</span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {useFormControl ? <FormControl>{Trigger}</FormControl> : Trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none border-none focus-visible:ring-0 placeholder:text-muted-foreground"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Command shouldFilter={false}>
          <CommandList className="max-h-[300px]">
            {loading && (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
              </div>
            )}
            {!loading && options.length === 0 && (
              <CommandEmpty>{emptyMessage}</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((option) => {
                const optValue = getValue(option)
                const isSelected = String(value) === String(optValue)
                return (
                  <CommandItem
                    key={optValue}
                    value={String(optValue)}
                    onPointerDown={(e) => {
                      // Evita que el input robe el foco y anule el clic
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      onChange(isSelected ? "" : optValue)
                      setOpen(false)
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {renderOption ? renderOption(option) : getLabel(option)}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
