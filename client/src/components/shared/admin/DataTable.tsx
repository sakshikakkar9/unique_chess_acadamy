import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
}

const DataTable = <T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete,
  onRowClick,
  isLoading,
}: DataTableProps<T>) => {
  if (isLoading) {
    return (
      <div className="rounded-md border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead key={i}>{col.header}</TableHead>
              ))}
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-full bg-muted animate-pulse rounded" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Grid View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <MoreHorizontal className="h-8 w-8" />
              <p className="text-[10px] font-black uppercase tracking-widest">No records found</p>
            </div>
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4"
              onClick={() => onRowClick?.(item)}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  {columns.map((col, i) => (
                    <div key={i}>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{col.header}</p>
                      <div className="text-sm text-slate-600">
                        {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                      </div>
                    </div>
                  ))}
                </div>

                {(onEdit || onDelete) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-50 rounded-full">
                        <MoreHorizontal className="h-4 w-4 text-slate-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onEdit && (
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                      )}
                      {onDelete && (
                        <DropdownMenuItem
                          onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hidden md:block">
        <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
            {columns.map((col, i) => (
              <TableHead key={i} className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-12">
                {col.header}
              </TableHead>
            ))}
            {(onEdit || onDelete) && <TableHead className="w-12"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                className="h-32 text-center"
              >
                <div className="flex flex-col items-center gap-2 text-slate-300">
                  <MoreHorizontal className="h-8 w-8" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No records found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow
                key={item.id}
                className={`group hover:bg-sky-50/50 transition-colors border-b border-slate-100 last:border-0 ${onRowClick ? "cursor-pointer" : ""}`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((col, i) => (
                  <TableCell key={i} className="py-4 px-4 text-sm text-slate-600">
                    {col.cell ? col.cell(item) : (item[col.accessorKey as keyof T] as React.ReactNode)}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell className="text-right pr-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {onEdit && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(item); }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
};

export default DataTable;
