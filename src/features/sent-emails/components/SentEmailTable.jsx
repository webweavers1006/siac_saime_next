"use client";

import { useSentEmailTableFilters } from "../hooks/use-sent-email-table-filters";
import { SentEmailTableView } from "./SentEmailTableView";

export function SentEmailTable({ data, pagination }) {
  const { isPending, filters, paginationState, sortConfig, handlers } =
    useSentEmailTableFilters(pagination);

  return (
    <SentEmailTableView
      items={data}
      isPending={isPending}
      pagination={paginationState}
      filters={filters}
      sortConfig={sortConfig}
      handlers={handlers}
    />
  );
}
