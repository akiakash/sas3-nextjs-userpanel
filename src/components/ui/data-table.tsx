import React from "react";
import { ChevronDown, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description: string;
  };
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState = {
    title: "No results found",
    description: "Try adjusting your search filters or check back later.",
  },
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300",
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-[var(--ink)] dark:text-zinc-200">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 text-[11px] font-bold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    "px-5 py-4 font-bold border-b border-r border-zinc-200 dark:border-zinc-800 last:border-r-0",
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading Skeleton State
              Array.from({ length: 4 }).map((_, rIdx) => (
                <tr
                  key={rIdx}
                  className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-5 py-4 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0"
                    >
                      <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <div className="mx-auto flex flex-col items-center justify-center max-w-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 text-[var(--brand)] mb-4 border border-zinc-200 dark:border-zinc-700">
                      <Inbox className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-base font-bold tracking-tight text-zinc-900 dark:text-white">
                      {emptyState.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {emptyState.description}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rIdx) => (
                <tr
                  key={rIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={cn(
                    "border-b border-zinc-200 dark:border-zinc-800 last:border-b-0 hover:bg-zinc-50/70 dark:hover:bg-zinc-800/40 transition-colors duration-250",
                    onRowClick ? "cursor-pointer" : ""
                  )}
                >
                  {columns.map((col, cIdx) => {
                    const value = col.accessorKey
                      ? (row[col.accessorKey] as React.ReactNode)
                      : null;
                    return (
                      <td
                        key={cIdx}
                        className={cn(
                          "px-5 py-4 text-[13px] font-medium tracking-tight text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800 last:border-r-0",
                          col.className
                        )}
                      >
                        {col.cell ? col.cell(row, rIdx) : value}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
