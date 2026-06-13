"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { TablePagination } from "./TablePagination";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente de tabla genérico y reutilizable basado en TanStack Table.
 * 
 * @param {Object[]} data - Datos a mostrar.
 * @param {Object[]} columns - Configuración de columnas.
 * @param {Object} selection - Configuración de selección { selectedIds, onSelectRow, onSelectAll, isAllSelected, isIndeterminate }.
 * @param {Object} pagination - Configuración de paginación { currentPage, totalPages, onPageChange, currentCount, totalCount, entityName }.
 * @param {Object} sortConfig - Configuración de ordenamiento externo { key, direction }.
 * @param {Function} onSort - Función para manejar el cambio de ordenamiento externo.
 * @param {string} emptyMessage - Mensaje para mostrar cuando no hay datos.
 * @param {boolean} isLoading - Estado de carga para mostrar esqueletos.
 */
export function DataTable({
  data = [],
  columns,
  selection,
  pagination,
  sortConfig,
  onSort,
  emptyMessage = "No hay resultados.",
  isLoading = false,
}) {
  const [sorting, setSorting] = useState([]);

  // Adaptamos las columnas recibidas al formato de TanStack Table
  const tableColumns = useMemo(() => {
    const cols = [];

    // Columna de selección si existe
    if (selection) {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={selection.isAllSelected}
            onCheckedChange={selection.onSelectAll}
            className={selection.isIndeterminate ? "opacity-50" : ""}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={selection.selectedIds.has(row.original.id)}
            onCheckedChange={(checked) => selection.onSelectRow(row.original.id, checked)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        size: 50,
      });
    }

    // Columnas dinámicas
    const dynamicCols = columns.map((col) => ({
      accessorKey: col.accessorKey,
      id: col.id || col.accessorKey,
      header: ({ column }) => {
        if (!col.sortable) return <div className={col.className}>{col.header}</div>;

        // Si hay onSort externo, usamos el sortConfig externo
        if (onSort) {
          const activeKey = col.sortKey || col.accessorKey;
          const isSorted = sortConfig?.key === activeKey ? sortConfig.direction : null;
          
          return (
            <div 
              className={`flex items-center cursor-pointer hover:text-foreground transition-colors ${col.className || ""}`}
              onClick={() => {
                const nextDir = isSorted === "asc" ? "desc" : "asc";
                onSort(activeKey, nextDir);
              }}
            >
              {col.header}
              {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4 text-primary font-bold" />}
              {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4 text-primary font-bold" />}
              {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/30" />}
            </div>
          );
        }

        // Si no hay onSort, usamos el ordenamiento interno de TanStack
        const isSorted = column.getIsSorted();
        return (
          <div 
            className={`flex items-center cursor-pointer hover:text-foreground transition-colors ${col.className || ""}`}
            onClick={() => column.toggleSorting(isSorted === "asc")}
          >
            {col.header}
            {isSorted === "asc" && <ArrowUp className="ml-2 h-4 w-4 text-primary" />}
            {isSorted === "desc" && <ArrowDown className="ml-2 h-4 w-4 text-primary" />}
            {!isSorted && <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />}
          </div>
        );
      },
      cell: ({ row }) => {
        const content = col.cell ? col.cell(row.original) : row.getValue(col.accessorKey);
        return <div className={col.cellClassName}>{content}</div>;
      },
      enableSorting: col.sortable,
      size: col.width ? parseInt(col.width) : undefined,
    }));

    return [...cols, ...dynamicCols];
  }, [columns, selection, onSort, sortConfig]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card text-card-foreground overflow-hidden">
        <Table>
          <TableHeader className="data-table-header">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    style={{
                      width: header.column.columnDef.size,
                      minWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              <React.Fragment>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={selection?.selectedIds?.has(row.original.id) && "selected"}
                    className={
                      isLoading 
                        ? "opacity-40 pointer-events-none select-none transition-opacity duration-500" 
                        : "data-table-row"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        style={{
                          width: cell.column.columnDef.size,
                          minWidth: cell.column.columnDef.size,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </React.Fragment>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {tableColumns.map((col, j) => (
                    <TableCell key={`cell-skeleton-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-32 text-center text-sm text-muted-foreground">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <TablePagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
          currentCount={pagination.currentCount}
          totalCount={pagination.totalCount}
          entityName={pagination.entityName}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
