import { cn } from "@/lib/utils";
import { ArrowUpDown, Search } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  rowKey?: keyof T;
  actions?: (row: T) => React.ReactNode;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  sortKey,
  sortDir,
  onSort,
  emptyMessage = "暂无数据",
  rowKey = "id" as keyof T,
  actions,
}: DataTableProps<T>) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {searchPlaceholder && onSearchChange && (
        <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      )}
      <div className="overflow-auto max-h-[60vh]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-900 z-10">
            <tr className="text-left text-xs text-gray-500 border-b border-gray-800">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-medium",
                    col.sortable && "cursor-pointer select-none hover:text-gray-300",
                    col.className
                  )}
                  onClick={() => col.sortable && onSort?.(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && onSort && (
                      <ArrowUpDown className={cn("h-3 w-3", sortKey === col.key ? "text-purple-400" : "text-gray-600")} />
                    )}
                  </span>
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-medium w-24">操作</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-10 text-center text-gray-600 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={String(row[rowKey])} className="hover:bg-gray-800/50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-4 py-3 text-gray-300", col.className)}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && <td className="px-4 py-3">{actions(row)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
