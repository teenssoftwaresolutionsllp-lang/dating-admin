"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | ((row: T) => string);
  filterOptions?: {
    label: string;
    key: keyof T;
    values: string[];
  };
  pageSize?: number;
  onRowClick?: (row: T) => void;
  actions?: React.ReactNode;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search records...",
  searchKey,
  filterOptions,
  pageSize = 8,
  onRowClick,
  actions,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Search matching
      let matchesSearch = true;
      if (search && searchKey) {
        let val = "";
        if (typeof searchKey === "function") {
          val = searchKey(row);
        } else {
          val = String(row[searchKey] || "");
        }
        matchesSearch = val.toLowerCase().includes(search.toLowerCase());
      } else if (search) {
        matchesSearch = Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter matching
      let matchesFilter = true;
      if (filterOptions && selectedFilter !== "ALL") {
        matchesFilter = String(row[filterOptions.key]) === selectedFilter;
      }

      return matchesSearch && matchesFilter;
    });
  }, [data, search, searchKey, filterOptions, selectedFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="bg-[#151F30] border border-[#263247] rounded-2xl overflow-hidden shadow-sm">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#263247] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 bg-[#0D1424] border border-[#263247] rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {filterOptions && (
            <div className="relative flex-shrink-0">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#0D1424] border border-[#263247] text-xs text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-pink-500 appearance-none pr-7 cursor-pointer"
              >
                <option value="ALL">All {filterOptions.label}</option>
                {filterOptions.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <Filter
                size={12}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-[#263247] text-slate-400 font-medium bg-[#0D1424]/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 font-semibold text-slate-300 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263247]/50">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`py-3.5 px-4 text-slate-200 ${
                        col.align === "right"
                          ? "text-right"
                          : col.align === "center"
                          ? "text-center"
                          : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-slate-400"
                >
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-[#263247] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 bg-[#0D1424]/20">
        <div>
          Showing{" "}
          <span className="font-semibold text-slate-200">
            {filteredData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-200">
            {Math.min(currentPage * pageSize, filteredData.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-200">
            {filteredData.length}
          </span>{" "}
          entries
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#263247] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="px-3 py-1 font-mono text-slate-300">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#263247] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

