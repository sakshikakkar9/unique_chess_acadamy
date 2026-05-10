import React from "react";
import RowActionMenu from "./RowActionMenu";
import { cn } from "@/lib/utils";

export interface AdminTableColumn {
  key: string;
  label: string;
  hiddenOn?: 'mobile' | 'tablet';
  align?: 'left' | 'right';
  className?: string;
}

interface AdminTableProps {
  columns: AdminTableColumn[];
  rows: any[];
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  onRowClick?: (row: any) => void;
  isLoading?: boolean;
}

const AdminTable: React.FC<AdminTableProps> = ({
  columns,
  rows,
  onEdit,
  onDelete,
  onRowClick,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="bg-uca-bg-surface border border-uca-border rounded-xl p-12 flex flex-col items-center justify-center gap-4">
        <div className="size-8 border-4 border-uca-accent-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-uca-text-muted uppercase tracking-widest">Loading records...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="bg-uca-bg-surface border border-uca-border rounded-xl p-12 text-center">
        <p className="text-uca-text-muted">No records found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-uca-border bg-uca-bg-surface">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="bg-uca-bg-elevated border-b border-uca-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-6 py-4 font-bold text-uca-text-muted uppercase tracking-wider text-[11px]",
                    col.hiddenOn === 'tablet' && "hidden lg:table-cell",
                    col.align === 'right' && "text-right",
                    col.className
                  )}
                >
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-4 text-right font-bold text-uca-text-muted uppercase tracking-wider text-[11px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-uca-border">
            {rows.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "hover:bg-uca-bg-elevated transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-6 py-4 text-uca-text-primary",
                      col.hiddenOn === 'tablet' && "hidden lg:table-cell",
                      col.align === 'right' && "text-right",
                      col.className
                    )}
                  >
                    {row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end">
                    <RowActionMenu
                      onEdit={() => onEdit(row)}
                      onDelete={() => onDelete(row)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-3 md:hidden">
        {rows.map((row, i) => (
          <div
            key={row.id || i}
            onClick={() => onRowClick?.(row)}
            className="relative bg-uca-bg-surface rounded-xl p-4 border border-uca-border shadow-sm active:bg-uca-bg-elevated transition-colors"
          >
            <div className="pr-12">
              {/* First column as title */}
              <div className="text-sm font-semibold text-uca-text-primary mb-2">
                {row[columns[0].key]}
              </div>

              {/* Remaining columns as key:value */}
              <div className="space-y-1.5">
                {columns.slice(1).filter(col => col.hiddenOn !== 'mobile').map((col) => (
                  <div key={col.key} className="flex justify-between gap-4 text-xs">
                    <span className="text-uca-text-muted shrink-0">{col.label}:</span>
                    <span className="text-uca-text-primary text-right">{row[col.key]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="absolute top-1 right-1"
              onClick={(e) => e.stopPropagation()}
            >
              <RowActionMenu
                onEdit={() => onEdit(row)}
                onDelete={() => onDelete(row)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTable;
